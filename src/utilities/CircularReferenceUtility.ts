import { Relation, IDatabaseAdapter } from '../database/IDatabaseAdapter'
import { HashMap } from '../ExportsSheet'

class Vertex {
    nodeId: string;
    parentsIdArray: string[] = [];
}

/**
 * If the child node turned out to be a parent of the parent node. A circular reference exists between the nodes.
 * Example: A = B + C. if B | C is a parent of A throw circular reference error.
 * 
 * Depth first algorithm is used to traverse the graph model.
 */
export class CircularReferenceClient {
    private nodeId: string;
    private childId: string;
    private visitedVerticesMap: HashMap<boolean> = {};
    private vertexCache: HashMap<Vertex> = {};
    private traverseStack: Vertex[] = [];

    GraphModelService: IDatabaseAdapter;

    constructor(GraphModelService: IDatabaseAdapter, nodeId: string, childId: string) {
        this.nodeId = nodeId;
        this.childId = childId;
        this.GraphModelService = GraphModelService;
    }

    public async lazyLoadVertexFromDB(nodeId: string): Promise<Vertex> {
        try {
            if (this.vertexCache[nodeId] != null)
                return this.vertexCache[nodeId];

            const parentsRelations: Relation[] = await this.GraphModelService.getNodeParentsRelations(nodeId);
            const parents: string[] = parentsRelations.map((rel) => {
                return rel.PARENT_ID;
            });
            const v: Vertex = {
                nodeId: nodeId,
                parentsIdArray: parents
            };
            this.vertexCache[nodeId] = v;
            return v;
        } catch (error) {
            throw error;
        }
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
     * 1- Visit the adjacent unvisited vertex. Mark it as visited. Check if it match the child ID. Push it in a stack.
     * 2- If no adjacent vertex is found, Or if all adjacent vertices are visited. Pop up a vertex from the stack.
     * 3- Repeat Rule 1 and Rule 2 until the stack is empty.
     * @param nodeId Node ID that is used to load a vertex from DB.
     * @returns True if there is a circular reference. False otherwise.
     */
    public async traverseGraphForCircularReference(nodeId: string): Promise<boolean> {
        try {
            let hasCircuralReference: boolean = false;
            // load Vertex from Node value in the DB.
            const rootVertex: Vertex = await this.lazyLoadVertexFromDB(nodeId);
            // Mark it as visited
            await this.markVertexAsVisited(rootVertex.nodeId);
            // push it to stack
            this.traverseStack.push(rootVertex);
            // repeat for parents that is not visited yet.
            while (this.traverseStack.length > 0) {
                const currentVertex = this.traverseStack.pop();
                // Circular Reference found???
                hasCircuralReference = this.childId == currentVertex.nodeId;
                if (hasCircuralReference) break;

                for (const id of currentVertex.parentsIdArray) {
                    const isVisitedVertex = await this.isVisitedVertex(id);
                    if (!isVisitedVertex) {
                        const aVertex = await this.lazyLoadVertexFromDB(id);
                        this.traverseStack.push(aVertex);
                        await this.markVertexAsVisited(aVertex.nodeId);
                    }
                }
            }
            return hasCircuralReference;
        } catch (error) {
            throw error;
        }
    }

    async checkCircularReference(): Promise<boolean> {
        // If the child ID is the same as node ID. circuralRef detected return true.
        if (this.nodeId == this.childId)
            return true;

        // Start with root Node.
        const result: boolean = await this.traverseGraphForCircularReference(this.nodeId);
        return result;
    }
}

export const CheckCircularReference = (GraphModelService: IDatabaseAdapter, nodeId: string, childId: string) => new CircularReferenceClient(GraphModelService, nodeId, childId).checkCircularReference();