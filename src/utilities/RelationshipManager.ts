import { IDatabaseAdapter, Node, Relation, EventType } from '../database/IDatabaseAdapter'
import * as Exports from '../ExportsSheet'
import { CheckCircularReference } from './CircularReferenceUtility';

export class RelationshipManager {
    private node: Node;
    private cellsInFormula: Node[] = [];
    public oldChildrenRelations: Relation[] = [];
    GraphModelService: IDatabaseAdapter;

    constructor(GraphModelService: IDatabaseAdapter, node: Node, cellsInFormula: Node[]) {
        try {
            this.node = node;
            this.cellsInFormula = cellsInFormula;
            this.GraphModelService = GraphModelService;
        } catch (error) {
            throw error
        }
    }

    public async loadOldChildrenRelationships(): Promise<any> {
        try {
            this.oldChildrenRelations = await this.GraphModelService.getNodeChildrenRelations(Exports.generateId(this.node));
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async handleOldChildrenTraverseOrder() {
        try {
            const promises: Promise<any>[] = this.oldChildrenRelations.map(async (relation: Relation) => {
                const childNodeDoc = await this.GraphModelService.getNodeDocument(relation.CHILD_ID);
                if (childNodeDoc.exists) {
                    const order = await this.GraphModelService.handleNodeTraverseOrder(relation.CHILD_ID, 'dec');
                }
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    public async removeOldChildrenRelationships(): Promise<any> {
        try {
            await this.loadOldChildrenRelationships();
            await this.GraphModelService.removeNodeChildrensRelations(Exports.generateId(this.node));
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async removeOrphanedChildren(): Promise<any> {
        try {
            const promises: Promise<any>[] = this.oldChildrenRelations.map(async (relation: Relation) => {
                const relations = await this.GraphModelService.getNodeParentsRelations(relation.CHILD_ID);
                if (relations.length < 1) await this.GraphModelService.removeNode(relation.CHILD_ID);
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    /**
     * 1- Remove current parent/child relationship.
     * 2- Remove child node if it is an orphan.
     * 3- Handle the traverse order of child node.
     * 
     * @returns promise
     * @throws error
     */
    public async handleRelationshipOfChildRemoved(): Promise<any> {
        try {
            const promises: Promise<any>[] = this.cellsInFormula.map(async (cell, index) => {
                let order: number;
                const cellId = Exports.generateId(cell);
                const relation = {
                    CHILD_ID: cellId,
                    PARENT_ID: Exports.generateId(this.node)
                } as Relation;
                await this.GraphModelService.removeRelationship(relation)

                const relations = await this.GraphModelService.getNodeParentsRelations(relation.CHILD_ID);
                if (relations.length < 1) await this.GraphModelService.removeNode(relation.CHILD_ID);

                const childNodeDoc = await this.GraphModelService.getNodeDocument(relation.CHILD_ID);
                if (childNodeDoc.exists) {
                    const order = await this.GraphModelService.handleNodeTraverseOrder(relation.CHILD_ID, 'dec');
                }
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    public async createNewChildrenRelationships(): Promise<any> {
        try {
            const promises: Promise<any>[] = this.cellsInFormula.map(async (cell, index) => {
                let order: number;
                const cellId = Exports.generateId(cell);
                const cellNodeDoc = await this.GraphModelService.getNodeDocument(cellId);
                if (cellNodeDoc.exists)
                    order = cellNodeDoc.data().TRAVERSE_ORDER == null ? 0 : cellNodeDoc.data().TRAVERSE_ORDER + 1;

                else
                    order = 0;
                await this.GraphModelService.addRelationship({
                    CHILD_ID: cellId,
                    PARENT_ID: Exports.generateId(this.node),
                    ORDER: order
                })
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    public async handleNewChildrenTraverseOrder() {
        try {
            const promises: Promise<any>[] = this.cellsInFormula.map(async (cell: Node) => {
                const cellId = Exports.generateId(cell);
                const childNodeDoc = await this.GraphModelService.getNodeDocument(cellId);
                if (childNodeDoc.exists) {
                    const order = await this.GraphModelService.handleNodeTraverseOrder(cellId, 'inc');
                    console.log(`handleNewChildrenTraverseOrder(${cellId}). order(${order})`);
                }
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    public async addNewNodesForChildren(): Promise<any> {
        try {
            const promises: Promise<any>[] = this.cellsInFormula.map(async (cell) => {
                const cellId: string = Exports.generateId(cell);

                //check if cell exists in the Graph
                const cellNodeDoc = await this.GraphModelService.getNodeDocument(cellId);
                //if exists lets check for circular refs
                const flagForCircuralRef = cellNodeDoc.exists;
                console.info('Are we checking circular? ' + flagForCircuralRef);
                if (!flagForCircuralRef) {
                    await this.GraphModelService.addNode(cell);
                } else {
                    const hasCircuralRef = await this.checkCircuralReference(this.GraphModelService, cellId);
                    if (!hasCircuralRef)
                        await this.GraphModelService.updateNodeData(cellId, cell);
                    else
                        throw `Circural Ref detected between. C[${cellId}] & P[${Exports.generateId(this.node)}]`;
                }
            });
            return Promise.all(promises).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    public async checkCircuralReference(FirestoreDbService: IDatabaseAdapter, cellId: string): Promise<boolean> {
        const result: boolean = await CheckCircularReference(FirestoreDbService, Exports.generateId(this.node), cellId);
        return result;
    }

    /**
     * handleFormulaChangeExistingNode
     */
    public async handleFormulaChangeExistingNode() {
        try {
            await this.removeOldChildrenRelationships();
            await this.removeOrphanedChildren();
            await this.handleOldChildrenTraverseOrder();
            await this.addNewNodesForChildren();
            await this.createNewChildrenRelationships();
            await this.handleNewChildrenTraverseOrder();
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * handleFormulaChangeNewNode
     */
    public async handleFormulaChangeNewNode() {
        try {
            await this.addNewNodesForChildren();
            await this.createNewChildrenRelationships();
            await this.handleNewChildrenTraverseOrder();
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * handleMyChildrenChangeExistingNode
     */
    public async handleMyChildrenChangeExistingNode(eventType: EventType) {
        try {
            switch (eventType) {
                case EventType.CHILD_ADDED:
                    await this.addNewNodesForChildren();
                    await this.createNewChildrenRelationships();
                    await this.handleNewChildrenTraverseOrder();
                    break;

                case EventType.CHILD_REMOVED:
                    await this.handleRelationshipOfChildRemoved();
                    break;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * handleMyChildrenChangeNewNode
     */
    public async handleMyChildrenChangeNewNode(eventType: EventType) {
        try {
            if (!(eventType == EventType.FUNCTION_CREATED))
                throw 'Event type is not compatible with MyChildren operation.'

            await this.addNewNodesForChildren();
            await this.createNewChildrenRelationships();
            await this.handleNewChildrenTraverseOrder();
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export const HandleRelationsFormulaChangeExistingNode = (GraphModelService: IDatabaseAdapter, node: Node, cellsInFormula: Node[]) =>
    new RelationshipManager(GraphModelService, node, cellsInFormula).handleFormulaChangeExistingNode();

export const HandleRelationsFormulaChangeNewNode = (GraphModelService: IDatabaseAdapter, node: Node, cellsInFormula: Node[]) =>
    new RelationshipManager(GraphModelService, node, cellsInFormula).handleFormulaChangeNewNode();

export const HandleRelationsMyChildrenChangeExistingNode = (GraphModelService: IDatabaseAdapter, node: Node, cellsInFormula: Node[], eventType: EventType) =>
    new RelationshipManager(GraphModelService, node, cellsInFormula).handleMyChildrenChangeExistingNode(eventType);

export const HandleRelationsMyChildrenChangeNewNode = (GraphModelService: IDatabaseAdapter, node: Node, cellsInFormula: Node[], eventType: EventType) =>
    new RelationshipManager(GraphModelService, node, cellsInFormula).handleMyChildrenChangeNewNode(eventType);