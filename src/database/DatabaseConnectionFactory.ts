import { IDatabaseAdapter } from './IDatabaseAdapter';
import { DataModelAdapter } from './DataModelImpl';
import { GraphModelAdapter } from './GraphModelImpl';

enum DATABASE_SERVICE {
    dataModel = 0,
    graphModel = 1
}

class ConnectionFactory {
    private dataModelAdapter: IDatabaseAdapter = null;
    private graphModelAdapter: IDatabaseAdapter = null;

    constructor() {
        this.dataModelAdapter = this.dataModelAdapter || new DataModelAdapter();
        this.graphModelAdapter = this.graphModelAdapter || new GraphModelAdapter();
    }

    public getServiceInstance(database_service: DATABASE_SERVICE): IDatabaseAdapter {
        switch (database_service) {
            case DATABASE_SERVICE.dataModel:
                return this.dataModelAdapter;

            case DATABASE_SERVICE.graphModel:
                return this.graphModelAdapter;

            default:
                throw new Error('Unsupported Service');
        }
    }
}

const cf = new ConnectionFactory();
export const GraphModelService = () => { return cf.getServiceInstance(DATABASE_SERVICE.graphModel) };
export const DataModelService = () => { return cf.getServiceInstance(DATABASE_SERVICE.dataModel) };