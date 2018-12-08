import { RelationshipManager } from '../../src/utilities/RelationshipManager'
import { Node, IDatabaseAdapter, Relation } from '../../src/database/IDatabaseAdapter'

import * as chai from 'chai';

const expect = chai.expect;

class SnapshotFakeFormulaArray_dataobject {
    data(): any {
        const d = [
            { "colId": "fake", "rowId": "fake", "sheetId": "fake" },
            { "subtype": "start", "type": "function", "value": "sum" },
            { "subtype": "cell", "type": "operand", "value": { "colId": "fakechild", "rowId": "fakechild", "sheetId": "fakechild" } },
            { "subtype": "", "type": "argument", "value": "," },
            { "subtype": "cell", "type": "operand", "value": { "colId": "fakechild2", "rowId": "fakechild2", "sheetId": "fakechild2" } }
        ];
        return d;
    }
}

class SnapshotFakeFormulaArray_datamodel {
    public docs: SnapshotFakeFormulaArray_dataobject[] = []
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

    handleNodeTraverseOrderCalledCounter: number = 0;

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
        this.handleNodeTraverseOrderCalledCounter++;
        return Promise.resolve(0)
    }

    addNode = (nodeValue: Node) => {
        this.addNodeCalled = true;
        return Promise.resolve("");
    }

    updateNode = (nodeId: string, nodeValue: Node) => {
        this.updateNodeCalled = true;
        return Promise.resolve("")
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

describe('Load Old Children Relationships "loadOldChildrenRelationships()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]

        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);

        expect(await rm.loadOldChildrenRelationships()).to.be.ok;
        expect(fakeGraphModelAdapter.getNodeChildrenRelationsCalled).to.be.true;
    });
});

describe('Handle Old Children Traverse Order "handleOldChildrenTraverseOrder()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.handleOldChildrenTraverseOrder()).to.be.ok;
        expect(fakeGraphModelAdapter.handleNodeTraverseOrderCalled).to.true;
        expect(fakeGraphModelAdapter.handleNodeTraverseOrderCalledCounter).to.equals(2);
    });
});

describe('Remove Old Children Relationships "removeOldChildrenRelationships()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.removeOldChildrenRelationships()).to.be.ok;
        expect(fakeGraphModelAdapter.removeNodeChildrensRelationsCalled).to.be.true;
    });
});

describe('Remove Orphaned Children "removeOrphanedChildren()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.removeOrphanedChildren()).to.be.ok;
        expect(fakeGraphModelAdapter.getNodeParentsRelationsCalled).to.be.true;
        expect(fakeGraphModelAdapter.removeNodeCalled).to.be.true;
    });
});

describe('Remove Orphaned Children "removeOrphanedChildren()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.createNewChildrenRelationships()).to.be.ok;
        expect(fakeGraphModelAdapter.getNodeDocumentCalled).to.be.true;
        expect(fakeGraphModelAdapter.addRelationshipCalled).to.be.true;
    });
});

describe('Handle New Children Traverse Order "handleNewChildrenTraverseOrder()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.handleNewChildrenTraverseOrder()).to.be.ok;
        expect(fakeGraphModelAdapter.handleNodeTraverseOrderCalled).to.be.true;
        expect(fakeGraphModelAdapter.handleNodeTraverseOrderCalledCounter).to.equal(2);
    });
});

describe('Add New Nodes For Children "addNewNodesForChildren()"', () => {

    it('should detect Circular Ref', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(async () => await rm.addNewNodesForChildren()).to.throw;
    });

    it('should be ok', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
                SHEET_ID: '-KuUNYD3gdsfANyb23mVt8Q',
                ROW_ID: 'JCZIwBfsdf8J8Z',
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
            },
            {
                SHEET_ID: '-KuUssakNYD3gANyb23mVt8Q',
                ROW_ID: 'JCZIwBsdf8J8Z',
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.addNewNodesForChildren()).to.be.ok;
    });
});

describe('Handle Formula Change Existing Node "handleFormulaChangeExistingNode()"', () => {

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
                SHEET_ID: '-KuUNYDds3gANyb23mVt8Q',
                ROW_ID: 'JCZIwsdB8J8Z',
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
            },
            {
                SHEET_ID: '-KudUNYsdvD3gANyb23mVt8Q',
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.handleFormulaChangeExistingNode()).to.be.ok;

    });

    it('should detect Circular Ref', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
                SHEET_ID: '-fake',
                ROW_ID: 'JCZIwsdB8J8Z',
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
            },
            {
                SHEET_ID: '-fake',
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(async () => await rm.handleFormulaChangeExistingNode()).to.throw;
    });
});

describe('Handle Formula Change New Node "handleFormulaChangeNewNode()"', () => {

    it('should detect Circular Ref', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
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

        const fakeNodeArr: Node[] = [
            {
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
            },
            {
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(async () => await rm.handleFormulaChangeNewNode()).to.be.ok;
    });

    it('should be ok with Normal Values', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeGraphModelAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray();
        const fakeNode: Node = {
            SHEET_ID: '-KuUNYccD3gANyb23mVt8Q',
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

        const fakeNodeArr: Node[] = [
            {
                SHEET_ID: '-KuUNsdfwwYD3gANyb23mVt8Q',
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
            },
            {
                SHEET_ID: '-KuUfsdfNYD3gANyb23mVt8Q',
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
        ]
        const rm = new RelationshipManager(fakeGraphModelAdapter, fakeNode, fakeNodeArr);
        rm.oldChildrenRelations = [
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' },
            { CHILD_ID: 'fake', ORDER: 0, PARENT_ID: 'fake' }
        ]
        fakeFirebaseAdapter.nodeExist = true;
        fakeGraphModelAdapter.nodeExist = true;
        expect(await rm.handleFormulaChangeNewNode()).to.be.ok;
    });
});
