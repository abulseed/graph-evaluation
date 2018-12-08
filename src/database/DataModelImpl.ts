import * as admin from 'firebase-admin';

import { Node, IDatabaseAdapter } from './IDatabaseAdapter';
import { generateId } from '../ExportsSheet';
import { LOG } from '../utilities/Logging'

var dataModel_database: any = null;

export class DataModelAdapter implements IDatabaseAdapter {
    constructor() {
        LOG.info(`Data Model Class Constructed`)
        try {
            if (dataModel_database == null) {
                var serviceAccount = require("../../resources/graph-eval-sdk.json");

                const adminApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL: "https://graph-eval.firebaseio.com"
                });

                dataModel_database = adminApp.firestore();
            }
        } catch (error) {
            throw error;
        }
    }

    addNode(nodeValue: any): any {
        throw 'Unsupported operation'
    }

    runTransactionFirestore(): any {
        throw 'Unsupported operation'
    }
    async getRecord(node: Node, path: string): Promise<any> {
        LOG.info(`getRecord from Data Model. ${JSON.stringify(node, null, 2)}, path= ${path}`)
        const doc = await dataModel_database.collection('sheets').doc(node.SHEET_ID).collection('cells').doc(generateId(node))
            .get().then((document: any) => { return document })
            .catch((error: any) => { throw error });
        return doc;
    }

    getRelationshipDocument(relationId: string): any {
        throw 'Unsupported operation'
    }

    removeNodeChildrensRelations(nodeId: string): any {
        throw 'Unsupported operation'
    }

    getNodeParentsRelations(nodeId: string): any {
        throw 'Unsupported operation'
    }

    getNodeChildrenRelations(nodeId: string): any {
        throw 'Unsupported operation'
    }

    createNodeRelationship(relation: any, path: string): any {
        throw 'Unsupported operation'
    }

    handleExistingChildRelations(nodeId: string, path: string): any {
        throw 'Unsupported operation'
    }

    checkCircularReference(nodeId: string, cellId: string): any {
        throw 'Unsupported operation'
    }

    removeNodeAllRelationships(nodeId: string): any {
        throw 'Unsupported operation'
    }

    handleNodeTraverseOrder(nodeId: string, operation: string): any {
        throw 'Unsupported operation'
    }

    async updateNodeData(nodeId: string, nodeValue: Node): Promise<any> {
        LOG.info(`updateNode from Data Model. nodeId= ${nodeId}, ${JSON.stringify(nodeValue, null, 2)}`)
        try {
            console.log('nodeValue.updateNode', JSON.stringify(nodeValue, null, 2));
            if (!nodeId) {
                nodeId = generateId(nodeValue);
            }

            console.log('nodeId.updateNode', nodeId);
            return dataModel_database.collection('sheets').doc(nodeValue.SHEET_ID).collection('cells').doc(nodeId)
                .update({
                    data: nodeValue.CELL_VALUE
                }).catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    async updateNodeValidationData(nodeId: string, nodeValue: Node): Promise<any> {
        LOG.info(`updateNode from Data Model. nodeId= ${nodeId}, ${JSON.stringify(nodeValue, null, 2)}`)
        try {
            console.log('nodeValue.updateNode', JSON.stringify(nodeValue, null, 2));
            if (!nodeId) {
                nodeId = generateId(nodeValue);
            }

            console.log('nodeId.updateNode', nodeId);
            return dataModel_database.collection('sheets').doc(nodeValue.SHEET_ID).collection('cells').doc(nodeId)
                .update({
                    validationData: nodeValue.CELL_VALIDATION_VALUE
                }).catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    removeRelationship(relation: any): any {
        throw 'Unsupported operation'
    }

    addRelationship(relation: any): any {
        throw 'Unsupported operation'
    }

    openBatchForWrites(): any {
        throw 'Unsupported operation'
    }

    addBatchedWrites(collection: string, docId: string, value: any): any {
        throw 'Unsupported operation'
    }

    commitBatchForWrites(): any {
        throw 'Unsupported operation'
    }

    handleNodeDependencyCounter(nodeId: string, operation: string): any {
        throw 'Unsupported operation'
    }

    removeNode(nodeId: string): any {
        throw 'Unsupported operation'
    }

    getNodeDocument(node: any): any {
        throw 'Unsupported operation'
    }

    async fireErrorFirebase(node: Node, error: Error): Promise<any> {
        LOG.info(`fireErrorFirebase from Data Model. ${JSON.stringify(node, null, 2)},${JSON.stringify(error, null, 2)}`)
        return dataModel_database.collection('sheets').doc(node.SHEET_ID).collection('cells').doc(generateId(node))
            .update({
                error: error.message
            }).catch((error: any) => { throw error });
    }

    removeCollectionFirebase(docRef: any, path: string): Promise<any> {
        LOG.info(`removeCollectionFirebase from Data Model. ${JSON.stringify(docRef, null, 2)}, path = ${path}`)
        try {
            return docRef.delete().catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    getAllParentsForNode(nodeId: string): any {
        throw 'Unsupported operation'
    }

    attachListener(path: string, eventName: string, callbackFunction: any) {
        LOG.info(`attachListener from Data Model. path = ${path}, eventName = ${eventName}`)
        try {
            dataModel_database.collection(path).onSnapshot(callbackFunction)
        } catch (error) {
            throw error;
        }
    }
}