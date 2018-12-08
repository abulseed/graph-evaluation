import * as admin from 'firebase-admin';

import { Relation, Node, IDatabaseAdapter } from './IDatabaseAdapter';
import { Variables, generateRelationshipIdFirestore, generateId } from '../ExportsSheet';

import { LOG } from '../utilities/Logging'

var graphModel_database: any = null;
var batch: any = null;

export class GraphModelAdapter implements IDatabaseAdapter {
    constructor() {
        LOG.info(`Graph Model Class Constructed`)
        try {
            if (graphModel_database == null) {
                var serviceAccount = require("../../resources/graph-eval-sdk.json");

                const adminApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                }, 'firestore');

                graphModel_database = adminApp.firestore();
            }
        } catch (error) {
            throw error;
        }
    }

    getRecord(node: Node, path: string): any {
        throw 'Unsupported operation'
    }

    async getRelationshipDocument(relationId: string): Promise<any> {
        LOG.info(`getRelationshipDocument from Graph Model. relationId= ${relationId}`)

        try {
            const doc = await graphModel_database.collection(Variables.firestore_collection_relations_name).doc(relationId).get()
                .then((document: any) => { return document })
                .catch((error: any) => {
                    throw error;
                });
            return doc;
        } catch (error) {
            throw error;
        }
    }

    async updateNodeData(nodeId: string, node: Node): Promise<any> {
        LOG.info(`updateNode from Graph Model. nodeId= ${nodeId} , ${JSON.stringify(node, null, 2)} `)

        try {
            return graphModel_database.collection(Variables.firestore_collection_nodes_name).doc(nodeId)
                .update(node).catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    async updateNodeValidationData(nodeId: string, node: Node): Promise<any> {
        LOG.info(`updateNodeValidationData from Graph Model. nodeId= ${nodeId} , ${JSON.stringify(node, null, 2)} `)

        try {
            return graphModel_database.collection(Variables.firestore_collection_nodes_name).doc(nodeId)
                .update(
                    {
                        validationData: node.CELL_VALIDATION_VALUE,
                        validationDataO: node.VALIDATION_FORMULA_OBJ

                    }
                ).catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    async getNodeDocument(nodeId: string): Promise<any> {
        LOG.info(`getNodeDocument from Graph Model. nodeId= ${nodeId}`)

        try {
            const doc = await graphModel_database.collection(Variables.firestore_collection_nodes_name).doc(nodeId)
                .get().then((document: any) => { return document })
                .catch((error: any) => { throw error });
            return doc;
        } catch (error) {
            throw error;
        }
    }

    async addNode(nodeValue: Node): Promise<any> {
        LOG.info(`addNode from Graph Model. ${JSON.stringify(nodeValue, null, 2)}`)

        try {
            return graphModel_database.collection(Variables.firestore_collection_nodes_name)
                .doc(generateId(nodeValue)).set(nodeValue).catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    async removeRelationship(relation: Relation): Promise<any> {
        LOG.info(`removeRelationship from Graph Model. ${JSON.stringify(relation, null, 2)}`)

        try {
            return graphModel_database.collection(Variables.firestore_collection_relations_name).doc(generateRelationshipIdFirestore(relation))
                .delete().catch((error: any) => { throw error });
        } catch (error) {
            throw error;
        }
    }

    async addRelationship(relation: Relation): Promise<any> {
        LOG.info(`addRelationship from Graph Model. ${JSON.stringify(relation, null, 2)}`)

        try {
            return graphModel_database.collection(Variables.firestore_collection_relations_name).doc(generateRelationshipIdFirestore(relation))
                .set(relation).catch((error: any) => { throw error });
        } catch (error) {
            throw error
        }
    }

    async openBatchForWrites(): Promise<any> {
        LOG.info(`openBatchForWrites from Graph Model`)

        try {
            batch = graphModel_database.batch();
        } catch (error) {
            throw error;
        }
    }
    async addBatchedWrites(collection: string, docId: string, value: Node | Relation): Promise<any> {
        LOG.info(`addBatchedWrites from Graph Model. collection= ${collection}, docId= ${docId}, ${JSON.stringify(value, null, 2)}`)

        try {
            var docRef = graphModel_database.collection(collection).doc(docId);
            batch.set(docRef, value);
        } catch (error) {
            throw error;
        }
    }
    async commitBatchForWrites(): Promise<void> {
        LOG.info(`commitBatchForWrites from Graph Model`)

        try {
            // Commit the batch
            batch.commit().then(() => {
                console.log('Commit batched writes is done.')
            });
        } catch (error) {
            throw error;
        }
    }

    async runTransactionFirestore(): Promise<any> {
        LOG.info(`runTransactionFirestore from Graph Model`)

        try {
            return graphModel_database.runTransaction();
        } catch (error) {
            throw error;
        }
    }

    async handleNodeTraverseOrder(nodeId: string, operation: string): Promise<number> {
        LOG.info(`handleNodeTraverseOrder. nodeId = ${nodeId} , operation= ${operation}`)

        try {
            const nodeRef = graphModel_database.collection(Variables.firestore_collection_nodes_name).doc(nodeId);
            return graphModel_database.runTransaction((t: any) => {
                return t.get(nodeRef)
                    .then((doc: any) => {
                        if (!doc.exists)
                            throw `Trying to handle traverse order for non existent node(${nodeId})`;
                        switch (operation) {
                            case 'dec':
                                const decCounter: number = doc.data().TRAVERSE_ORDER == null ? 0 : doc.data().TRAVERSE_ORDER - 1;
                                t.update(nodeRef, { TRAVERSE_ORDER: decCounter });
                                return decCounter;
                            case 'inc':
                                const incCounter: number = doc.data().TRAVERSE_ORDER == null ? 0 : doc.data().TRAVERSE_ORDER + 1;
                                t.update(nodeRef, { TRAVERSE_ORDER: incCounter });
                                return incCounter;
                            default:
                                throw 'handleNodeTraverseOrder: Unsupported operation';
                        }
                    });
            })
        } catch (error) {
            throw error;
        }
    }

    removeCollectionFirebase(nodeId: string, path: string): any {
        throw 'Unsupported operation'
    }

    async removeNode(nodeId: string): Promise<any> {
        LOG.info(`removeNode from Graph Model. nodeId= ${nodeId}`)

        try {
            console.log(`removeNode(${nodeId})`);
            return graphModel_database.collection(Variables.firestore_collection_nodes_name).doc(nodeId)
                .delete().catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    async getNodeParentsRelations(nodeId: string): Promise<Relation[]> {
        LOG.info(`getNodeParentsRelations from Graph Model. nodeId=${nodeId}`)

        try {
            const querySnapshot = await graphModel_database.collection(Variables.firestore_collection_relations_name)
                .where(Variables.firestore_field_childId, "==", nodeId)
                .orderBy(Variables.firestore_field_relation_order)
                .get().then((snapshot: any) => { return snapshot })
                .catch((err: any) => { throw err });

            const relations: Relation[] = querySnapshot.docs.map((doc: any) => {
                return {
                    CHILD_ID: doc.data().CHILD_ID,
                    PARENT_ID: doc.data().PARENT_ID,
                    ORDER: doc.data().ORDER
                } as Relation;
            });
            return relations;
        } catch (error) {
            throw error;
        }
    }

    async getNodeChildrenRelations(nodeId: string): Promise<Relation[]> {
        LOG.info(`getNodeChildrenRelations from Graph Model. NodeID: ${nodeId}`)
        try {
            const querySnapshot = await graphModel_database.collection(Variables.firestore_collection_relations_name)
                .where(Variables.firestore_field_parentId, "==", nodeId)
                .orderBy(Variables.firestore_field_relation_order)
                .get().then((snapshot: any) => { return snapshot })
                .catch((err: any) => { throw err });

            const relations: Relation[] = querySnapshot.docs.map((doc: any) => {
                return {
                    CHILD_ID: doc.data().CHILD_ID,
                    PARENT_ID: doc.data().PARENT_ID,
                    ORDER: doc.data().TRAVERSE_ORDER
                } as Relation;
            });
            return relations;
        } catch (error) {
            throw error;
        }
    }

    async removeNodeChildrensRelations(nodeId: string): Promise<any> {
        LOG.info(`removeNodeChildrensRelations from Graph Model: ${nodeId}`)
        try {
            const query = graphModel_database.collection(Variables.firestore_collection_relations_name)
                .where(Variables.firestore_field_parentId, "==", nodeId)
                .limit(Variables.firestore_delete_collection_batch_size);

            return new Promise(function (resolve, reject) {
                deleteQueryBatch(graphModel_database, query, Variables.firestore_delete_collection_batch_size, resolve, reject);
            }).catch((err: any) => { throw err });
        } catch (error) {
            throw error;
        }
    }

    attachListener(path: string, eventName: string, callbackFunction: any) {
        throw 'Unsupported Operation';
    }

    fireErrorFirebase(node: Node, error: Error): any {
        throw 'Unsupported Operation';
    }
}

function deleteQueryBatch(db: any, query: any, batchSize: number, resolve: (value?: any) => void, reject: (value?: any) => void) {
    LOG.info(`deleteQueryBatch from Graph Model. db= ${db}, query= ${query}, batchSize= ${batchSize}`)
    try {
        query.get()
            .then((snapshot: any) => {
                // When there are no documents left, we are done
                if (snapshot.size == 0) {
                    return 0;
                }

                // Delete documents in a batch
                var batch = db.batch();
                snapshot.docs.forEach((doc: any) => {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(() => {
                    return snapshot.size;
                });
            }).then((numDeleted: any) => {
                if (numDeleted === 0) {
                    resolve();
                    return;
                }

                // Recurse on the next process tick, to avoid
                // exploding the stack.
                process.nextTick(() => {
                    deleteQueryBatch(db, query, batchSize, resolve, reject);
                });
            })
            .catch(reject);
    } catch (error) {
        throw error;
    }
}