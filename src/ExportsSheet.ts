import { Relation, Node } from './database/IDatabaseAdapter';

export interface HashMap<V> { [propName: string]: V; }

export const generateId = (node: Node) => {
    return node.SHEET_ID + ":" + node.ROW_ID + ":" + node.COL_ID;
}

export const generateIdFirebase = (node: Node) => {
    return `sheetID/${node.SHEET_ID}/row/${node.ROW_ID}/${node.COL_ID}`;
}

export const generateRelationshipIdFirestore = (relation: Relation) => {
    return `${relation.PARENT_ID}|${relation.CHILD_ID}`;
}

export const convertToNodeFromDBDocument = (doc: any) => {
    return {
        SHEET_ID: doc.data().SHEET_ID,
        ROW_ID: doc.data().ROW_ID,
        COL_ID: doc.data().COL_ID,
        CELL_VALUE: doc.data().CELL_VALUE,
        FORMULA_OBJ: doc.data().FORMULA_OBJ,
        TRAVERSE_ORDER: doc.data().TRAVERSE_ORDER,
        VIRTUAL: false
    } as Node;
}

export class Variables {
    static readonly firebase_graph_model_user: string = 'GRAPH_MODEL';
    static readonly firebase_collection_changed_cells: string = 'cell_queue';
    static readonly firebase_collection_changed_formulas: string = 'formula_queue';
    static readonly firebase_collection_changed_mychildren: string = 'mychildren_queue';
    static readonly firebase_collection_changed_validation_formula: string = 'validation_queue';
    static readonly firestore_collection_nodes_name: string = 'NODES';
    static readonly firestore_collection_relations_name: string = 'RELATIONS';
    static readonly firestore_field_childId: string = "CHILD_ID";
    static readonly firestore_field_parentId: string = "PARENT_ID";
    static readonly firestore_field_super_parentId = "SUPER_PARENT_ID";
    static readonly firestore_field_relation_order: string = "ORDER";
    static readonly firestore_field_sheetId: string = "SHEET_ID";
    static readonly firestore_field_rowId: string = "ROW_ID";
    static readonly firestore_field_colId: string = "COL_ID";
    static readonly firestore_field_cellvalue: string = "CELL_VALUE";
    static readonly firestore_field_tokens: string = "TOKENS";
    static readonly firestore_field_dependencycounter: string = "DEPENDENCY_COUNTER";
    static readonly firestore_delete_collection_batch_size: number = 10;
    static readonly token_type_function: string = "function";
    static readonly token_type_operand: string = "operand";
    static readonly token_type_subexpression: string = "subexpression";
    static readonly token_type_argument: string = "argument";
    static readonly token_type_operator_infix: string = ": stringoperator-infix";
    static readonly token_type_operator_prefix: string = ": stringoperator-prefix";
    static readonly token_sub_type_start: string = "start";
    static readonly token_sub_type_stop: string = "stop";
    static readonly token_sub_type_cell: string = "cell";
    static readonly token_sub_type_number: string = "number";
    static readonly token_sub_type_logical: string = "logical";
    static readonly token_sub_type_math: string = "math";
}