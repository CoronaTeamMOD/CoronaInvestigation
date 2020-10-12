import dotenv from 'dotenv';
const appinsights = require('applicationinsights');
import { createLogger, transports, format, Logger as winstonLogger } from 'winston';

import { MethodsLogMessage, LogMessage, InitialLogMessage, LogType, Environment } from '../Models/Logger/types';

dotenv.config();

appinsights.setup(process.env.INSTRUMENTATION_KEY).start();

class Logger {

    logger: winstonLogger;

    constructor() {
        this.logger = createLogger({
            transports: [
                new transports.Console()
            ],
            format: format.combine(
                format.timestamp(),
                format.printf(info => {
                    const initialLog: InitialLogMessage = { 
                        type: info.level as LogType, 
                        timestamp: new Date(info.timestamp).toLocaleString('he-IL') ,
                        environment: process.env.ENVIRONMENT as Environment
                    };
                    const messageFromMethod: MethodsLogMessage = JSON.parse(JSON.stringify(info.message));
                    const outputLog: LogMessage = {
                        ...initialLog,
                        ...messageFromMethod
                    }
                    if (JSON.parse(process.env.SHOULD_POST_TO_AZURE)) {
                        this._postToAzure(outputLog);
                    }
                    return JSON.stringify(outputLog);
                })
            )
        });
    }

    _postToAzure(logMessage: LogMessage) {
        appinsights.defaultClient.trackEvent({
            name: logMessage.workflow + ', ' + logMessage.step,
            properties: logMessage
        })
    }
    
    warning(logMessage: MethodsLogMessage) {
        this.logger.warn(logMessage);
    }

    error(logMessage: MethodsLogMessage) {
        this.logger.error(logMessage);
    }

    info(logMessage: MethodsLogMessage) {
        this.logger.info(logMessage);
    }

}

const logger: Logger = new Logger();

export default logger;