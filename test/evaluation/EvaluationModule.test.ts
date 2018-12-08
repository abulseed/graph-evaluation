
import { EvaluationModel } from '../../src/evaluation/EvaluationModule';
import { Formula, Node, IDatabaseAdapter, Relation } from '../../src/database/IDatabaseAdapter'

import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';

const expect = chai.expect;

class SnapshotFakeFormulaArray_dataobject {
    data(): any {
        const d = {
            idObj: {
                "colId": "J6F3X4HqVJVkHHcyOOvi",
                "rowId": "P1feHlUhb0z4MudjGw6q",
                "sheetId": "FMbZrJxcH53PGFoPPVmq"
            },
            formulaObj: {
                "operands": [
                    { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                    { "type": "number", "value": "5" },
                    { "type": "string", "value": "string_value" },
                    {
                        "type": "formula", "nestedFormulaObj": {
                            "idObj": {
                                "colId": "J6F3X4HqVJVkHHcyOOvi",
                                "rowId": "P1feHlUhb0z4MudjGw6q",
                                "sheetId": "FMbZrJxcH53PGFoPPVmq"
                            },
                            "formulaObj": {
                                "operands": [
                                    { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                                    { "type": "number", "value": "5" }
                                ],
                                "operation": "sum"
                            }
                        }
                    },
                    { "type": "mychildren", "value": {} },
                ],
                "operation": "sum"
            }
        };
        return d;
    }
}

const snapshot_obj = new SnapshotFakeFormulaArray_dataobject();
class SnapshotFakeFormulaArray_datamodel {
    public docs: SnapshotFakeFormulaArray_dataobject[] = [snapshot_obj]
}


class SnapshotFakeFormulaArray {
    val(): any {
        const data = [
            { "colId": "fake", "rowId": "fake", "sheetId": "fake" },
            { "subtype": "start", "type": "function", "value": "sum" },
            { "subtype": "cell", "type": "operand", "value": { "colId": "fakechild", "rowId": "fakechild", "sheetId": "fakechild" } },
            { "subtype": "", "type": "argument", "value": "," },
            { "subtype": "cell", "type": "operand", "value": { "colId": "fakechild2", "rowId": "fakechild2", "sheetId": "fakechild2" } }
        ];
        return data;
    }
}

class SnapshotFakeOnCell {
    val = () => {
        return {
            colId: 'fake',
            data: 'fake',
            rowId: 'fake',
            sheetId: 'fake',
            userId: 'fake'
        }
    }
}

class SnapshotFakeFormulaValue {
    exists = true
    data(): any {
        const data = 5;
        return data;
    }

    val(): any {
        const data = 5;
        return data;
    }
}



class FakeDbAdapter implements IDatabaseAdapter {
    nodeExist: boolean = false;
    nodeObj: any = { CHILD_ID: "fakechild", PARENT_ID: "fakechild", ORDER: "fake" };

    removeNodeChildrensRelationsCalled: boolean = false;
    getNodeParentsRelationsCalled: boolean = false;
    getNodeChildrenRelationsCalled: boolean = false;
    removeRelationshipCalled: boolean = false;
    addRelationshipCalled: boolean = false;
    getRelationshipDocumentCalled: boolean = false;
    handleNodeTraverseOrderCalled: boolean = false;
    addNodeCalled: boolean = false;
    updateNodeCalled: boolean = false;
    getNodeDocumentCalled: boolean = false;
    removeNodeCalled: boolean = false;
    openBatchForWritesCalled: boolean = false;
    addBatchedWritesCalled: boolean = false;
    commitBatchForWritesCalled: boolean = false;
    runTransactionFirestoreCalled: boolean = false;
    fireErrorFirebaseCalled: boolean = false;
    removeCollectionFirebaseCalled: boolean = false;
    getRecordCalled: boolean = false;
    attachListenerCalled: boolean = false;

    updateNodeData(nodeId: string, nodeValue: Node): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateNodeValidationData(nodeId: string, nodeValue: Node): Promise<any> {
        throw new Error('Method not implemented.');
    }

    removeNodeChildrensRelations = (s: string) => {
        this.removeNodeChildrensRelationsCalled = true;
        return Promise.resolve("")
    }
    getNodeParentsRelations = (nodeId: string) => {
        this.getNodeParentsRelationsCalled = true;
        return Promise.resolve([])
    }
    getNodeChildrenRelations = (nodeId: string) => {
        this.getNodeChildrenRelationsCalled = true;
        return Promise.resolve([])
    }

    removeRelationship = (relation: Relation) => {
        this.removeRelationshipCalled = true;
        return Promise.resolve("")
    }

    addRelationship = (relation: Relation) => {
        this.addRelationshipCalled = true;
        return Promise.resolve({ CHILD_ID: "fakechild", PARENT_ID: "fakechild", ORDER: "fake" })
    }

    getRelationshipDocument = (relationId: string) => {
        this.getRelationshipDocumentCalled = true;
        return Promise.resolve("")
    }

    handleNodeTraverseOrder = (nodeId: string, operation: string) => {
        this.handleNodeTraverseOrderCalled = true;
        return Promise.resolve(0)
    }

    addNode = (nodeValue: Node) => {
        this.addNodeCalled = true;
        return Promise.resolve("");
    }

    updateNode = (nodeId: string, nodeValue: Node) => {
        this.updateNodeCalled = true; return Promise.resolve("")
    }

    getNodeDocument = (nodeId: string) => {
        this.getNodeDocumentCalled = true;
        const fakeExsistsDocument = {
            exists: this.nodeExist,
            data(): any {
                const obj: any = {
                    TRAVERSE_ORDER: 0
                }
                return obj
            }
        }; return Promise.resolve(fakeExsistsDocument)
    }
    removeNode = (nodeId: string) => {
        this.removeNodeCalled = true;
        return Promise.resolve("")
    }

    openBatchForWrites = () => {
        this.openBatchForWritesCalled = true;
        return Promise.resolve("")
    }

    addBatchedWrites = (collection: string, docId: string, value: Node | Relation) => {
        this.addBatchedWritesCalled = true;
        return Promise.resolve("")
    }

    commitBatchForWrites = () => {
        this.commitBatchForWritesCalled = true;
        return new Promise<void>((resolve, reject) => { resolve(); })
    }

    runTransactionFirestore = () => {
        this.runTransactionFirestoreCalled = true;
        return Promise.resolve("")
    }

    fireErrorFirebase = (node: Node, error: Error) => {
        this.fireErrorFirebaseCalled = true;
        return Promise.resolve("")
    }

    removeCollectionFirebase = (nodeId: string, path: string) => {
        this.removeCollectionFirebaseCalled = true;
        return Promise.resolve("")
    }

    getRecord = (node: Node, path: string) => {
        this.getRecordCalled = true;
        const fakeSnapshot: SnapshotFakeFormulaValue = new SnapshotFakeFormulaValue();
        return Promise.resolve(fakeSnapshot)
    }

    attachListener = (path: string, eventName: string, callbackFunction: any) => {
        this.attachListenerCalled = true;
        return Promise.resolve("")
    }
}

describe('Testing evaluate Node By Formula "evaluateNodeByFormula(Node)"', () => {
    it('should be ok with normal Node', async () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter();
        const em = new EvaluationModel(fakeDB, fakeDB);

        const fakeNode: Node =
            {
                SHEET_ID: "FMbZrJxcH53PGFoPPVmq",
                ROW_ID: "P1feHlUhb0z4MudjGw6q",
                COL_ID: "J6F3X4HqVJVkHHcyOOvi",
                CELL_VALUE: '',
                FORMULA_OBJ: {
                    OPERANDS: [
                        { TYPE: "cell", VALUE: { colId: "col", rowId: "row", sheetId: "sheet" } },
                        { TYPE: "number", VALUE: "5" },
                        { TYPE: "string", VALUE: "string_value" },
                        {
                            TYPE: "formula", VALUE: {
                                "idObj": {
                                    "colId": "J6F3X4HqVJVkHHcyOOvi",
                                    "rowId": "P1feHlUhb0z4MudjGw6q",
                                    "sheetId": "FMbZrJxcH53PGFoPPVmq"
                                },
                                "formulaObj": {
                                    "operands": [
                                        { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                                        { "type": "number", "value": "5" }
                                    ],
                                    "operation": "sum"
                                }
                            }
                        },
                        { TYPE: "mychildren", VALUE: {} },
                    ],
                    OPERATION: "sum"
                },
                TRAVERSE_ORDER: 0,
                VIRTUAL: false,
            } as Node;
        expect(await em.evaluateNodeByFormula(fakeNode)).to.be.ok;
    });

    it('should throw error if node = null', async () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB)
        const fakeNode: Node = null;

        expect(async () => await em.evaluateNodeByFormula(fakeNode)).to.throw;
    });
});

describe('Evaluate Cells In Tokens "evaluateCellsInTokens(Node)"', () => {

    it('should throw error if node = null', async () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const fakeNode: Node = null;

        expect(async () => await em.eva(fakeNode)).to.throw;
    });

    it('should be ok with normal node ', async () => {
        const fakeDB: FakeDbAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);

        const fakeNode: Node = {
            SHEET_ID: "FMbZrJxcH53PGFoPPVmq",
            ROW_ID: "P1feHlUhb0z4MudjGw6q",
            COL_ID: "J6F3X4HqVJVkHHcyOOvi",
            CELL_VALUE: '',
            FORMULA_OBJ: {
                OPERANDS: [
                    { TYPE: "cell", VALUE: { colId: "col", rowId: "row", sheetId: "sheet" } },
                    { TYPE: "number", VALUE: "5" },
                    { TYPE: "string", VALUE: "string_value" },
                    {
                        TYPE: "formula", VALUE: {
                            "idObj": {
                                "colId": "J6F3X4HqVJVkHHcyOOvi",
                                "rowId": "P1feHlUhb0z4MudjGw6q",
                                "sheetId": "FMbZrJxcH53PGFoPPVmq"
                            },
                            "formulaObj": {
                                "operands": [
                                    { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                                    { "type": "number", "value": "5" }
                                ],
                                "operation": "sum"
                            }
                        }
                    },
                    { TYPE: "mychildren", VALUE: {} },
                ],
                OPERATION: "sum"
            },
            TRAVERSE_ORDER: 0,
            VIRTUAL: false,
        } as Node;
        fakeDB.nodeExist = true;
        expect(async () => await em.evaluateCellsInTokens(fakeNode)).to.be.ok;
    });
});


describe('Formula Evalution Testing "evaluateFormula(formula)"', () => {
    it('should be ok with normal formula', async () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const formula = { OPERANDS: [{ TYPE: "number", VALUE: "1" }, { TYPE: "number", VALUE: "2" }], OPERATION: 'sum' } as Formula;

        expect(await em.evaluateFormula(formula)).to.be.ok;
    });

    it('should equal the expected value (sum)', () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const formula = { OPERANDS: [{ TYPE: "number", VALUE: "1" }, { TYPE: "number", VALUE: "2" }], OPERATION: 'sum' } as Formula;

        expect(em.evaluateFormula(formula)).to.equal(3);
    });

    it('should equal the expected value (avg)', () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const formula = { OPERANDS: [{ TYPE: "number", VALUE: "1" }, { TYPE: "number", VALUE: "6" }, { TYPE: "number", VALUE: "2" }], OPERATION: 'avg' } as Formula;

        expect(em.evaluateFormula(formula)).to.equal(3);
    });

    it('should equal the expected value (max)', () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const formula = { OPERANDS: [{ TYPE: "number", VALUE: "1" }, { TYPE: "number", VALUE: "8" }, { TYPE: "number", VALUE: "2" }], OPERATION: 'max' } as Formula;


        expect(em.evaluateFormula(formula)).to.equal(8);
    });
});

describe('Evaluate Cells In Tokens"evaluateCellsInTokens(formula)"', () => {

    it('should be ok with Normal node', async () => {
        const fakeDB: IDatabaseAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(fakeDB, fakeDB);
        const fakeNode: Node = {
            SHEET_ID: '-KuUNYD3gANyb23mVt8Q',
            ROW_ID: 'JCZIwB8J8Z',
            COL_ID: 'E',
            CELL_VALUE: '',
            FORMULA_OBJ: {
                OPERANDS: [
                    { TYPE: "cell", VALUE: { colId: "col", rowId: "row", sheetId: "sheet" }, PROCESSING_VALUE: '' },
                    { TYPE: "number", VALUE: "5" },
                    { TYPE: "string", VALUE: "string_value" },
                    {
                        TYPE: "formula", VALUE: {
                            "idObj": {
                                "colId": "J6F3X4HqVJVkHHcyOOvi",
                                "rowId": "P1feHlUhb0z4MudjGw6q",
                                "sheetId": "FMbZrJxcH53PGFoPPVmq"
                            },
                            "formulaObj": {
                                "operands": [
                                    { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                                    { "type": "number", "value": "5" }
                                ],
                                "operation": "sum"
                            }
                        }
                    },
                    { TYPE: "mychildren", VALUE: {} },
                ],
                OPERATION: "sum"
            },
            TRAVERSE_ORDER: 0,
            VIRTUAL: false
        }
        expect(await em.evaluateCellsInTokens(fakeNode)).to.be.ok;
    });
});

describe('Start Reevaluation Of Node "startReevaluationOfNode(fakeNode)"', () => {

    it('should be ok with Normal node', async () => {
        const FirebaseFake: FakeDbAdapter = new FakeDbAdapter()
        const FirestoreFake: FakeDbAdapter = new FakeDbAdapter()
        const em = new EvaluationModel(FirebaseFake, FirestoreFake);
        const fakeNode: Node = {
            SHEET_ID: '-KuUNYD3gANyb23mVt8Q',
            ROW_ID: 'JCZIwB8J8Z',
            COL_ID: 'E',
            CELL_VALUE: '',
            FORMULA_OBJ: {
                OPERANDS: [
                    { TYPE: "cell", VALUE: { colId: "col", rowId: "row", sheetId: "sheet" }, PROCESSING_VALUE: '' },
                    { TYPE: "number", VALUE: "5" },
                    { TYPE: "string", VALUE: "string_value" },
                    {
                        TYPE: "formula", VALUE: {
                            "idObj": {
                                "colId": "J6F3X4HqVJVkHHcyOOvi",
                                "rowId": "P1feHlUhb0z4MudjGw6q",
                                "sheetId": "FMbZrJxcH53PGFoPPVmq"
                            },
                            "formulaObj": {
                                "operands": [
                                    { "type": "cell", "cellIdObj": { "colId": "col", "rowId": "row", "sheetId": "sheet" } },
                                    { "type": "number", "value": "5" }
                                ],
                                "operation": "sum"
                            }
                        }
                    },
                    { TYPE: "mychildren", VALUE: {} },
                ],
                OPERATION: "sum"
            },
            TRAVERSE_ORDER: 0,
            VIRTUAL: false
        }

        expect(await em.startReevaluationOfNode(fakeNode)).to.be.ok;
        expect(FirebaseFake.updateNodeCalled).to.be.true;
        expect(FirestoreFake.updateNodeCalled).to.be.true;
    });
});

