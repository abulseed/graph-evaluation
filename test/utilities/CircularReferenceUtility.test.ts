import { CircularReferenceClient } from '../../src/utilities/CircularReferenceUtility'
import { Node, IDatabaseAdapter, Relation } from '../../src/database/IDatabaseAdapter'

import * as chai from 'chai';

const expect = chai.expect;

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
        const fakeSnapshot: SnapshotFakeFormulaValue = new SnapshotFakeFormulaValue();
        return Promise.resolve(fakeSnapshot)
    }

    attachListener = (path: string, eventName: string, callbackFunction: any) => {
        this.attachListenerCalled = true;
        return Promise.resolve("")
    }
}


describe('Traverse Graph For Circular Reference "traverseGraphForCircularReference()"', async () => {
    it('should be ok', async () => {
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();
        const vertixId: string = "nodeId";
        const cr = new CircularReferenceClient(fakeFirestoreAdapter, "fakeNodeID", "fakeChild")
        expect(await cr.traverseGraphForCircularReference(vertixId)).to.be.false;
    });
});

describe('Mark Vertex As Visited "markVertexAsVisited(vertixId)"', () => {
    it('should be marked when calling the function', async () => {
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();

        const cr = new CircularReferenceClient(fakeFirestoreAdapter, "fakeNodeID", "fakeChild")
        const vertixId: string = "fakeId";

        expect(await cr.markVertexAsVisited(vertixId)).to.be.ok;

        expect(await cr.isVisitedVertex(vertixId).then()).to.eql(true);
    });
});

describe('Traverse Graph For Circular Reference "traverseGraphForCircularReference()"', () => {
    it('should return false', async () => {
        const fakeFirestoreAdapter: FakeDbAdapter = new FakeDbAdapter();
        const cr = new CircularReferenceClient(fakeFirestoreAdapter, "fakeNodeID", "fakeChild")
        expect(await cr.traverseGraphForCircularReference("fakeNodeID")).to.be.false;
    });
});