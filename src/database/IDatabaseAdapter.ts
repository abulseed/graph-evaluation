export interface Relation {
    PARENT_ID: string;
    CHILD_ID: string;
    ORDER: number;
}

export class Formula{
    OPERANDS:Operand[];
    OPERATION:string;
}

export class Operand{
    TYPE: string;
    VALUE: any;
    PROCESSING_VALUE?: string;
}

export enum EventType{
	CHILD_ADDED = 1,
	CHILD_REMOVED = 2,
	FUNCTION_CHANGED = 3,
	FUNCTION_REMOVED = 4,
	FUNCTION_CREATED = 5
}

export class Reactive_Formula extends Formula {
    EVENT_TYPE: EventType;
    constructor(_eventType:EventType) {
        super();
        this.EVENT_TYPE = _eventType;
    }
}

export class Validation_Formula extends Formula {
    EVENT_TYPE: EventType;
    constructor(_eventType:EventType) {
        super();
        this.EVENT_TYPE = _eventType;
    }
}

export class Node {
    SHEET_ID: string;
    ROW_ID: string;
    COL_ID: string;
    CELL_VALUE: string = '';
    CELL_VALIDATION_VALUE: string = '';
    FORMULA_OBJ: Formula;
    VALIDATION_FORMULA_OBJ: Validation_Formula;
    TRAVERSE_ORDER: number = 0;
    VIRTUAL: boolean = false;
}

export interface IDatabaseAdapter {
    removeNodeChildrensRelations(nodeId: string): Promise<any>;
    getNodeParentsRelations(nodeId: string): Promise<Relation[]>;
    getNodeChildrenRelations(nodeId: string): Promise<Relation[]>;
    removeRelationship(relation: Relation): Promise<any>;
    addRelationship(relation: Relation): Promise<any>;
    getRelationshipDocument(relationId: string): Promise<any>;
    handleNodeTraverseOrder(nodeId: string, operation: string): Promise<number>;

    addNode(nodeValue: Node): Promise<any>;
    updateNodeData(nodeId: string, nodeValue: Node): Promise<any>;
    updateNodeValidationData(nodeId: string, nodeValue: Node): Promise<any>;
    getNodeDocument(nodeId: string): Promise<any>;
    removeNode(nodeId: string): Promise<any>;
    openBatchForWrites(): Promise<any>;
    addBatchedWrites(collection: string, docId: string, value: Node | Relation): Promise<any>;
    commitBatchForWrites(): Promise<void>;

    runTransactionFirestore(): Promise<any>;

    fireErrorFirebase(node: Node, error: Error): Promise<any>;
    removeCollectionFirebase(nodeId: string, path: string): Promise<any>;
    getRecord(node: Node, path: string): Promise<any>;
    attachListener(path: string, eventName: string, callbackFunction: any): any;
}