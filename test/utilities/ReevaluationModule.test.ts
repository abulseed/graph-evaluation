import { ReevaluationClient } from '../../src/utilities/ReevaluationModule';
import { Node, IDatabaseAdapter, Relation } from '../../src/database/IDatabaseAdapter'

import * as mocha from 'mocha';
import * as chai from 'chai';

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
                OPERANDS: [
                   {TYPE: "cell", VALUE: {colId: "col", rowId: "row", sheetId: "sheet"}},
                   {TYPE: "number", VALUE: "5"},
                   {TYPE: "string", VALUE: "string_value"},
                   {TYPE: "formula", VALUE: {
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
                    {TYPE: "mychildren", VALUE: {}},
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
        const obj=new SnapshotFakeFormulaArray_dataobject;
        const data=obj.data()
        const fakeExsistsDocument = {
            exists: this.nodeExist,
            data(): any {
                const obj: any =  {
                    SHEET_ID: "FMbZrJxcH53PGFoPPVmq",
                    ROW_ID: "P1feHlUhb0z4MudjGw6q",
                    COL_ID: "J6F3X4HqVJVkHHcyOOvi",
                    CELL_VALUE: '',
                    FORMULA_OBJ:{
                        OPERANDS: [
                           {TYPE: "cell", VALUE: {colId: "col", rowId: "row", sheetId: "sheet"}},
                           {TYPE: "number", VALUE: "5"},
                           {TYPE: "string", VALUE: "string_value"},
                           {TYPE: "formula", VALUE: {
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
                            {TYPE: "mychildren", VALUE: {}},
                        ],
                        OPERATION: "sum"
                        },
                    TRAVERSE_ORDER: 0,
                    VIRTUAL: false,
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
        const obj={
                    data():any {return fakeSnapshot.data()},
                    exists:true
                 }
        return Promise.resolve(obj)
    }

    attachListener = (path: string, eventName: string, callbackFunction: any) => {
        this.attachListenerCalled = true;
        return Promise.resolve("")
    }
}



describe('Mark Vertex As Visited "markVertexAsVisited(Node)"', () => {

    it('should be marked as Visted', async () => {
        const fakeDB: FakeDbAdapter = new FakeDbAdapter()
        const nodeId:string="fakeid"
        const re = new ReevaluationClient(fakeDB, fakeDB,nodeId)

        expect(await re.markVertexAsVisited(nodeId)).to.be.ok;
        expect(await re.isVisitedVertex(nodeId).then()).to.be.true;

    });

});

describe('Reevaluate Node "reevaluateNode(Node)"', () => {
    
    it('should be ok', async () => {
        const fakefirebaseDB: FakeDbAdapter = new FakeDbAdapter()
        const fakefirestoreDB: FakeDbAdapter = new FakeDbAdapter()
        const nodeId:string="fakeid"
        fakefirestoreDB.nodeExist=true;
        fakefirebaseDB.nodeExist=true;
        const re = new ReevaluationClient(fakefirebaseDB, fakefirestoreDB,nodeId)

        expect(await re.reevaluateNode(nodeId)).to.be.ok;
        expect(fakefirestoreDB.getNodeDocumentCalled).to.be.true;
        expect(fakefirebaseDB.updateNodeCalled).to.be.true;
        expect(fakefirestoreDB.updateNodeCalled).to.be.true;
    });

    it('should throw error if nodeid = null', async () => {
        const fakefirebaseDB: FakeDbAdapter = new FakeDbAdapter();
        const fakefirestoreDB: FakeDbAdapter = new FakeDbAdapter();
        const nodeId:string=null;
        fakefirestoreDB.nodeExist=true;
        fakefirebaseDB.nodeExist=true;
        const re = new ReevaluationClient(fakefirebaseDB, fakefirestoreDB,nodeId);

        expect(async ()=>await re.reevaluateNode(nodeId)).to.throw;
    });

    it('should throw error if nodeid is empty', async () => {
        const fakefirebaseDB: FakeDbAdapter = new FakeDbAdapter();
        const fakefirestoreDB: FakeDbAdapter = new FakeDbAdapter();
        const nodeId:string="";
        fakefirestoreDB.nodeExist=true;
        fakefirebaseDB.nodeExist=true;
        const re = new ReevaluationClient(fakefirebaseDB, fakefirestoreDB,nodeId);

        expect(async ()=>await re.reevaluateNode(nodeId)).to.throw;
    });

});

describe('Reevaluate At My Node "reevaluateAtMyNode(Node)"', () => {
    
    it('should be ok', async () => {
        const fakefirebaseDB: FakeDbAdapter = new FakeDbAdapter()
        const fakefirestoreDB: FakeDbAdapter = new FakeDbAdapter()
        const nodeId:string="fakeid"
        fakefirestoreDB.nodeExist=true;
        fakefirebaseDB.nodeExist=true;
        const re = new ReevaluationClient(fakefirebaseDB, fakefirestoreDB,nodeId)

        expect(await re.reevaluateAtMyNode()).to.be.ok;
        
    });

});


describe('Traverse Graph For Reevaluation "traverseGraphForReevaluation()"', () => {
    
    it('should be ok', async () => {
        const fakefirebaseDB: FakeDbAdapter = new FakeDbAdapter();
        const fakefirestoreDB: FakeDbAdapter = new FakeDbAdapter();
        const nodeId:string="fakeid";
        const re = new ReevaluationClient(fakefirebaseDB, fakefirestoreDB,nodeId)

        expect(await re.traverseGraphForReevaluation()).to.be.ok;
        expect(fakefirestoreDB.getNodeParentsRelationsCalled).to.be.true;
        
        
    });
});