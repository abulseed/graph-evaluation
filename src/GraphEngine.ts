import { Variables, generateId, convertToNodeFromDBDocument } from './ExportsSheet';
import { Node, IDatabaseAdapter, Formula, Operand, Validation_Formula } from './database/IDatabaseAdapter';
import { EvaluationModel } from './evaluation/EvaluationModule';
import { HandleRelationsFormulaChangeExistingNode, HandleRelationsFormulaChangeNewNode, HandleRelationsMyChildrenChangeNewNode, HandleRelationsMyChildrenChangeExistingNode } from './utilities/RelationshipManager';
import { ReevaluateNodeParents } from './utilities/ReevaluationModule';

export class GraphEngine {
    DataModelService: IDatabaseAdapter;
    GraphModelService: IDatabaseAdapter;

    constructor() { }

    injectFirebase(DataModelService: IDatabaseAdapter) {
        try {
            this.DataModelService = DataModelService;
        } catch (error) {
            throw error
        }
    }

    injectFirestore(GraphModelService: IDatabaseAdapter) {
        try {
            this.GraphModelService = GraphModelService;
        } catch (error) {
            throw error;
        }
    }

    attachFormulaListener() {
        this.DataModelService.attachListener(Variables.firebase_collection_changed_formulas, 'child_added', this.onChangedFormulasChildAdded);
        console.info('firebase_collection_changed_formulas');
    }

    attachMyChildrenListener() {
        this.DataModelService.attachListener(Variables.firebase_collection_changed_mychildren, 'child_added', this.onChangedFormulasChildAdded);
        console.info('firebase_collection_changed_mychildren');
    }

    attachValidationFormulaListener() {
        this.DataModelService.attachListener(Variables.firebase_collection_changed_validation_formula, 'child_added', this.onChangedValidationFormulasChildAdded);
        console.info('firebase_collection_changed_validation_formula');
    }

    attachValueListener() {
        this.DataModelService.attachListener(Variables.firebase_collection_changed_cells, 'child_added', this.onChangedCellsChildAdded);
        console.info('firebase_collection_changed_cells');
    }

    onChangedFormulasChildAdded = async (snapshot: any) => {
        try {
            if (snapshot.docs.length <= 0)
                return true;
            const evaluationModel: EvaluationModel = new EvaluationModel(this.DataModelService, this.GraphModelService);
            console.log(`onChangedFormulasChildAdded, Snapshot: ${JSON.stringify(snapshot.docs[0].data(), null, 2)}`);
            let AST = snapshot.docs[0].data();
            this.DataModelService.removeCollectionFirebase(snapshot.docs[0].ref, Variables.firebase_collection_changed_formulas);
            const node: Node = this.convertToNodeWithFormula(AST);

            const nodeId: string = generateId(node);
            const nodeDocument = await this.GraphModelService.getNodeDocument(nodeId);
            const nodeExists = await nodeDocument.exists;
            console.info(`onChangedFormulasChildAdded. Node Exists? ${nodeExists}`);

            if (nodeExists) {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInFormula(node);

                const finalNode: Node = await evaluationModel.evaluateNodeByFormula(nodeNCells.node);

                await HandleRelationsFormulaChangeExistingNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula);

                await this.GraphModelService.updateNodeData(nodeId, finalNode);
                await this.DataModelService.updateNodeData(nodeId, finalNode);

                ReevaluateNodeParents(this.DataModelService, this.GraphModelService, nodeId);
            } else {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInFormula(node);

                const finalNode: Node = await evaluationModel.evaluateNodeByFormula(nodeNCells.node);

                await HandleRelationsFormulaChangeNewNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula);

                await this.GraphModelService.addNode(finalNode);
                await this.DataModelService.updateNodeData(nodeId, finalNode);
            }
            return true;
        } catch (error) {
            const node = this.convertToNode(snapshot.docs[0].data());
            console.error(`Error handling Formula Change Request. Node ID(${generateId(node)})`, error);
            this.DataModelService.fireErrorFirebase(node, error);
            return false;
        }
    }

    onChangedValidationFormulasChildAdded = async (snapshot: any) => {
        try {
            if (snapshot.docs.length <= 0)
                return true;
            const evaluationModel: EvaluationModel = new EvaluationModel(this.DataModelService, this.GraphModelService);
            console.log(`onChangedValidationFormulasChildAdded, Snapshot: ${JSON.stringify(snapshot.docs[0].data(), null, 2)}`);

            let AST = snapshot.docs[0].data();
            this.DataModelService.removeCollectionFirebase(snapshot.docs[0].ref, Variables.firebase_collection_changed_formulas);

            const node: Node = this.convertToNodeWithValidationFormula(AST);

            const nodeId: string = generateId(node);
            const nodeDocument = await this.GraphModelService.getNodeDocument(nodeId);
            const nodeExists = await nodeDocument.exists;
            console.info(`onChangedValidationFormulasChildAdded. Node Exists? ${nodeExists}`);
            if (nodeExists) {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInValidationFormula(node);
                const finalNode: Node = await evaluationModel.evaluateNodeByValidationFormula(nodeNCells.node);

                await HandleRelationsFormulaChangeExistingNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula);
                await this.GraphModelService.updateNodeData(nodeId, finalNode);
                await this.DataModelService.updateNodeValidationData(nodeId, finalNode);
                ReevaluateNodeParents(this.DataModelService, this.GraphModelService, nodeId);
            }
            else {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInValidationFormula(node);
                const finalNode: Node = await evaluationModel.evaluateNodeByValidationFormula(nodeNCells.node);

                await HandleRelationsFormulaChangeNewNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula);

                await this.GraphModelService.addNode(finalNode);
                await this.DataModelService.updateNodeValidationData(nodeId, finalNode);
            }
            return true;
        } catch (error) {
            const node = this.convertToNode(snapshot.docs[0].data());
            console.error(`Error handling ValidationFormula Change Request. Node ID(${generateId(node)})`, error);
            this.DataModelService.fireErrorFirebase(node, error);
            return false;
        }
    }

    onChangedMyChildrenChildAdded = async (snapshot: any) => {
        try {
            if (snapshot.docs.length <= 0)
                return true;
            const evaluationModel: EvaluationModel = new EvaluationModel(this.DataModelService, this.GraphModelService);
            console.log(`onChangedMyChildrenChildAdded, Snapshot: ${JSON.stringify(snapshot.docs[0].data(), null, 2)}`);

            let AST = snapshot.docs[0].data();
            this.DataModelService.removeCollectionFirebase(snapshot.docs[0].ref, Variables.firebase_collection_changed_mychildren);
            const eventType = AST.EVENT_TYPE;
            const node: Node = this.convertToNodeWithFormula(AST);

            const nodeId: string = generateId(node);
            const nodeDocument = await this.GraphModelService.getNodeDocument(nodeId);
            const nodeExists = await nodeDocument.exists;
            console.info(`onChangedMyChildrenChildAdded. Node Exists? ${nodeExists}`);
            if (nodeExists) {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInFormula(node);
                const nodeForEvaluatingMyChildren = this.mergeNodes(convertToNodeFromDBDocument(nodeDocument), nodeNCells.node);
                const finalNode: Node = await evaluationModel.evaluateNodeByFormula(nodeForEvaluatingMyChildren);

                await HandleRelationsMyChildrenChangeExistingNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula, eventType);

                await this.GraphModelService.updateNodeData(nodeId, finalNode);
                await this.DataModelService.updateNodeData(nodeId, finalNode);

                ReevaluateNodeParents(this.DataModelService, this.GraphModelService, nodeId);
            } else {
                const nodeNCells: { node: Node, cellsInFormula: Node[] } = await evaluationModel.evaluateCellsInFormula(node);
                const finalNode: Node = await evaluationModel.evaluateNodeByFormula(nodeNCells.node);

                await HandleRelationsMyChildrenChangeNewNode(this.GraphModelService, finalNode, nodeNCells.cellsInFormula, eventType);

                await this.GraphModelService.addNode(finalNode);
                await this.DataModelService.updateNodeData(nodeId, finalNode);
            }
            return true;
        } catch (error) {
            const node = this.convertToNode(snapshot.docs[0].data());
            console.error(`Error handling Formula Change Request. Node ID(${generateId(node)})`, error);
            this.DataModelService.fireErrorFirebase(node, error);
            return false;
        }
    }

    onChangedCellsChildAdded = async (snapshot: any) => {
        try {
            if (snapshot.docs.length <= 0)
                return true;
            const snapData = snapshot.docs[0].data();
            console.log(`onChangedCellsChildAdded, Snapshot: ${JSON.stringify(snapData, null, 2)}`);
            this.DataModelService.removeCollectionFirebase(snapshot.docs[0].ref, Variables.firebase_collection_changed_cells);

            const node: Node = {
                SHEET_ID: snapData.sheetId,
                ROW_ID: snapData.rowId,
                COL_ID: snapData.colId,
                CELL_VALUE: snapData.data
            } as Node;

            const nodeId: string = generateId(node);

            const nodeDocument = await this.GraphModelService.getNodeDocument(nodeId);

            const nodeExists = await nodeDocument.exists;
            console.info(`onChangedCellsChildAdded. Node exists? ${nodeExists}`)
            if (nodeExists) {
                await this.GraphModelService.updateNodeData(nodeId, { CELL_VALUE: node.CELL_VALUE } as Node);
                ReevaluateNodeParents(this.DataModelService, this.GraphModelService, nodeId);
            }
            return true;
        } catch (error) {
            const snapData = snapshot.docs[0].data();
            const node = {
                SHEET_ID: snapData.sheetId,
                ROW_ID: snapData.rowId,
                COL_ID: snapData.colId
            } as Node
            console.error(`Error handling Cell Data Change Request. Node ID(${generateId(node)})`, error);
            this.DataModelService.fireErrorFirebase(node, error);
            return false;
        }
    }

    convertToNodeWithFormula(nodeAST: any): Node {
        try {
            if (nodeAST == null || nodeAST == {})
                throw new Error('Cannot Accept null AST.')

            const formulaObj = JSON.parse(JSON.stringify(nodeAST.formulaObj));
            const node: Node = this.convertToNode(nodeAST);
            const tempFormula: Formula = formulaObj as Formula;
            node.FORMULA_OBJ = tempFormula;
            return node;
        } catch (error) {
            throw error
        }

    }

    convertToNodeWithValidationFormula(nodeAST: any): Node {
        try {
            if (nodeAST == null || nodeAST == {})
                throw new Error('Cannot Accept null AST.')

            const validationformulaObj = JSON.parse(JSON.stringify(nodeAST.validationformulaObj));
            const node: Node = this.convertToNode(nodeAST);
            const tempFormula: Validation_Formula = validationformulaObj as Validation_Formula;
            node.VALIDATION_FORMULA_OBJ = tempFormula;
            return node;
        } catch (error) {
            throw error
        }

    }

    mergeNodes(nodeDocument: Node, nodeObj: Node): Node {
        try {
            const result: Node = nodeDocument;
            result.FORMULA_OBJ.OPERATION = nodeObj.FORMULA_OBJ.OPERATION;
            result.FORMULA_OBJ.OPERANDS = result.FORMULA_OBJ.OPERANDS.concat(nodeObj.FORMULA_OBJ.OPERANDS);
            return result;
        } catch (error) {
            throw error;
        }
    }

    convertToNode(nodeAST: any): Node {
        try {
            if (nodeAST == null || nodeAST == {})
                throw new Error('Cannot Accept null AST.')
            if (!nodeAST.idObj.sheetId || !nodeAST.idObj.rowId || !nodeAST.idObj.colId)
                throw new Error('Cannot Accept null AST.')
            const node: Node = {
                SHEET_ID: nodeAST.idObj.sheetId,
                ROW_ID: nodeAST.idObj.rowId,
                COL_ID: nodeAST.idObj.colId,
                CELL_VALUE: nodeAST.data == null ? "" : nodeAST.data,
                CELL_VALIDATION_VALUE: nodeAST.validationData == null ? "" : nodeAST.validationData,
                FORMULA_OBJ: {} as Formula,
                VALIDATION_FORMULA_OBJ: {} as Validation_Formula,
                TRAVERSE_ORDER: 0,
                VIRTUAL: false
            };
            return node;
        } catch (error) {
            throw error
        }
    }
}