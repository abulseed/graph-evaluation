import * as winston from 'winston';

class Logger {
    constructor() {
        winston.configure({
            transports: [
                new (winston.transports.File)({
                    filename: 'databaseOperations.log',
                    level: 'info'
                })
            ]
        });
    }

    public getLoggerInstance(): any {
        return winston;
    }
}

export const LOG = new Logger().getLoggerInstance();