import { Node, Relation, IDatabaseAdapter } from '../database/IDatabaseAdapter'
import { HashMap, convertToNodeFromDBDocument } from '../ExportsSheet'
import { EvaluationModel } from '../evaluation/EvaluationModule';

/**
 * Reevaluate all the parents that depend on a node in the graph
 * 
 * Breadth first algorithm is used to traverse the graph model.
 */
export class ReevaluationClient {
    private nodeId: string;
    private visitedVerticesMap: HashMap<boolean> = {};
    private traverseQueue: string[] = [];

    DataModelService: IDatabaseAdapter;
    GraphModelService: IDatabaseAdapter;

    constructor(DataModelService: IDatabaseAdapter, GraphModelService: IDatabaseAdapter, nodeId: string) {
        this.DataModelService = DataModelService;
        this.GraphModelService = GraphModelService;
        this.nodeId = nodeId;
    }

    public async markVertexAsVisited(vertexId: string) {
        try {
            this.visitedVerticesMap[vertexId] = true;
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async isVisitedVertex(vertexId: string): Promise<boolean> {
        try {
            return this.visitedVerticesMap[vertexId] === true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 1- Visit the adjacent unvisited vertex. Mark it as visited. Reevaluate it. Insert it in a queue.
     * 2- If no adjacent vertex is found, remove the first vertex from the queue.
     * 3- Repeat Rule 1 and Rule 2 until the queue is empty.
     */
    public async traverseGraphForReevaluation() {
        try {
            // Mark it as visited
            await this.markVertexAsVisited(this.nodeId);
            // push it to stack
            this.traverseQueue.push(this.nodeId);
            // repeat for parents that is not visited yet.
            let entryPoint: boolean = true;
            while (this.traverseQueue.length > 0) {
                const currentVertexId = this.traverseQueue.shift();
                // Let's reevaluate Node of vertex ID.
                if (entryPoint) entryPoint = false;
                else await this.reevaluateNode(currentVertexId);

                const parents: Relation[] = await this.GraphModelService.getNodeParentsRelations(currentVertexId);
                for (const relation of parents) {
                    const isVisitedVertex = await this.isVisitedVertex(relation.PARENT_ID);
                    if (!isVisitedVertex) {
                        this.traverseQueue.push(relation.PARENT_ID);
                        await this.markVertexAsVisited(relation.PARENT_ID);
                    }
                }
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async reevaluateNode(nodeId: string) {
        try {
            const evaluationModule = new EvaluationModel(this.DataModelService, this.GraphModelService);
            const nodeDoc = await this.GraphModelService.getNodeDocument(nodeId);
            if (nodeDoc.exists) {
                const node: Node = convertToNodeFromDBDocument(nodeDoc);
                const nodeNCells = await evaluationModule.evaluateCellsInFormula(node);
                await evaluationModule.startReevaluationOfNode(nodeNCells.node);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async reevaluateAtMyNode() {
        try {
            if (this.nodeId == null)
                throw 'Set my Node first';

            console.log('reevaluateAtMyNode', this.nodeId)
            // Start with root Node.
            await this.traverseGraphForReevaluation();
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export const ReevaluateNodeParents = (DataModelService: IDatabaseAdapter, GraphModelService: IDatabaseAdapter, nodeId: string) => new ReevaluationClient(DataModelService, GraphModelService, nodeId).reevaluateAtMyNode();