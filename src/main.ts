import { GraphEngine } from './GraphEngine';
import { GraphModelService, DataModelService } from './database/DatabaseConnectionFactory'

class BackendApplication {
    private graphEngine: GraphEngine = new GraphEngine();
    constructor() {
        try {
            const dmService = DataModelService();
            this.graphEngine.injectFirebase(dmService);
            const gmService = GraphModelService();
            this.graphEngine.injectFirestore(gmService);
            process.on('unhandledRejection', (reason, p) => {
                console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
                console.log()
            });
        } catch (error) {
            console.error("Error", error);
        }
    }

    start() {
        try {
            this.graphEngine.attachFormulaListener();
            this.graphEngine.attachValueListener();
            this.graphEngine.attachMyChildrenListener();
            this.graphEngine.attachValidationFormulaListener();
            console.info("Graph Engine Started.")
        } catch (error) {
            console.error("Error", error);
        }
    }

}

const app: BackendApplication = new BackendApplication();
app.start();