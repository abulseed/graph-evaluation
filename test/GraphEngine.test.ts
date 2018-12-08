
import { GraphEngine } from '../src/GraphEngine';
import { Node, IDatabaseAdapter, Relation, Formula } from '../src/database/IDatabaseAdapter'

import * as mocha from 'mocha';
import * as chai from 'chai';
import { exists } from 'fs';

const expect = chai.expect;

console.log("GraphEngine Testing");


class SnapshotFakeFormulaArray_dataobject {
    data(): any {
        const d = {
            idObj: {
                "colId": "J6F3X4HqVJVkHHcyOOvi",
                "rowId": "P1feHlUhb0z4MudjGw6q",
                "sheetId": "FMbZrJxcH53PGFoPPVmq"
            },
            formulaObj: {
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
            }
        };
        return d;
    }
}

const snapshot_obj = new SnapshotFakeFormulaArray_dataobject();
class SnapshotFakeFormulaArray_datamodel {
    public docs: SnapshotFakeFormulaArray_dataobject[] = [snapshot_obj]
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
        const fakeSnapshot: SnapshotFakeFormulaArray_dataobject = new SnapshotFakeFormulaArray_dataobject();
        const obj = {
            data(): any { return fakeSnapshot.data() },
            exists: true
        }
        return Promise.resolve(obj)
    }

    attachListener = (path: string, eventName: string, callbackFunction: any) => {
        this.attachListenerCalled = true;
        return Promise.resolve("")
    }
}

const fakeDB: FakeDbAdapter = new FakeDbAdapter();
const GraphForTestFunctions = new GraphEngine();
GraphForTestFunctions.injectFirebase(fakeDB)
GraphForTestFunctions.injectFirestore(fakeDB)



describe('onChangedCellsChildAdded() Test', () => {

    it('should be ok', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray_datamodel();
        const ge = new GraphEngine();
        ge.injectFirebase(fakeFirebaseAdapter)
        ge.injectFirestore(fakeFirestoreAdapter)

        fakeFirebaseAdapter.nodeExist = false;
        fakeFirestoreAdapter.nodeExist = false;
        expect(await ge.onChangedCellsChildAdded(snapshotFake)).to.be.true;
    });


    it('should be ok', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const ge = new GraphEngine();
        ge.injectFirebase(fakeFirebaseAdapter)
        ge.injectFirestore(fakeFirestoreAdapter)

        const fsp = new SnapshotFakeFormulaArray_datamodel();

        expect(await ge.onChangedCellsChildAdded(fsp)).to.be.ok;
    });

    it('should throw error if corrupted Snapshot', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray_datamodel();
        const ge = new GraphEngine();
        ge.injectFirebase(fakeFirebaseAdapter)
        ge.injectFirestore(fakeFirestoreAdapter)
        expect(await ge.onChangedCellsChildAdded(snapshotFake)).to.throw;
    });

});




describe('Convert AST To Node "convertToNode(ASTnode)"', () => {

    it('should be ok with Normal ASTNode', () => {
        const snapshot = new SnapshotFakeFormulaArray_dataobject();
        const ASTNode = snapshot.data();
        expect(GraphForTestFunctions.convertToNode(ASTNode)).to.be.ok;
    });

    it('should return the expected ASTNode', () => {
        const snapshot = new SnapshotFakeFormulaArray_dataobject();
        const ASTNode = snapshot.data();

        let expectedNode: Node = {
            SHEET_ID: "FMbZrJxcH53PGFoPPVmq",
            ROW_ID: "P1feHlUhb0z4MudjGw6q",
            COL_ID: "J6F3X4HqVJVkHHcyOOvi",
            CELL_VALUE: "",
            FORMULA_OBJ: {} as Formula,
            TRAVERSE_ORDER: 0,
            VIRTUAL: false
        };
        expect(GraphForTestFunctions.convertToNode(ASTNode)).to.eql(expectedNode);
    });


    it('should throw error if empty ASTNode', () => {
        let ASTNode: any = {};
        expect(() => GraphForTestFunctions.convertToNode(ASTNode)).to.throw;
    });


    it('should throw error with null ASTNode', () => {
        let ASTNode: any = null;
        expect(() => GraphForTestFunctions.convertToNode(ASTNode)).to.throw;
    });

    it('should throw error if corrupted ASTNode', () => {
        let ASTNode: any = { "colId": "H", "rowId": "5156aGPsMZ", "sheetId": "" };
        expect(() => GraphForTestFunctions.convertToNode(ASTNode)).to.throw();

    });


    it('should throw error if there is a missing property', () => {
        let ASTNode: any = { "colId": "H", "rowId": "5156aGPsMZ" };
        expect(() => GraphForTestFunctions.convertToNode(ASTNode)).to.throw();
    });
});




describe('Convert To Node With Formula "convertToNodeWithFormula(AST)"', () => {

    it('should be ok with Normal AST', () => {
        const snapshot = new SnapshotFakeFormulaArray_dataobject();
        const AST = snapshot.data();

        expect(GraphForTestFunctions.convertToNodeWithFormula(AST)).to.be.ok;
    });

    it('should return the same expected tokens array', () => {
        const snapshot = new SnapshotFakeFormulaArray_dataobject();
        const AST = snapshot.data();

        let expectedNode: any =

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

        expect(GraphForTestFunctions.convertToNodeWithFormula(AST)).to.eql(expectedNode);
    });

});

describe('Testing Change Formulas "onChangedFormulasChildAdded(snapshot)"', () => {

    it('should be ok with Normal Snapshot if node exists', async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray_datamodel();

        const ge = new GraphEngine();
        ge.injectFirebase(fakeFirebaseAdapter)
        ge.injectFirestore(fakeFirestoreAdapter)

        fakeFirebaseAdapter.nodeExist = true;
        fakeFirestoreAdapter.nodeExist = true;

        expect(await ge.onChangedFormulasChildAdded(snapshotFake)).to.be.ok;
    });

    it("should be ok with Normal Snapshot if node doesn't exists", async () => {
        const fakeFirebaseAdapter: FakeDbAdapter = new FakeDbAdapter();
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const snapshotFake = new SnapshotFakeFormulaArray_datamodel();

        const ge = new GraphEngine();
        ge.injectFirebase(fakeFirebaseAdapter)
        ge.injectFirestore(fakeFirestoreAdapter)

        fakeFirebaseAdapter.nodeExist = false;
        fakeFirestoreAdapter.nodeExist = false;

        expect(await ge.onChangedFormulasChildAdded(snapshotFake)).to.be.true;
    });

});
