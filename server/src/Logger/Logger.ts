import dotenv from 'dotenv';
const appinsights = require('applicationinsights');
import { createLogger, transports, format, Logger as winstonLogger } from 'winston';

import { MethodsLogMessage, LogMessage, InitialLogMessage, LogType, Environment, Severity, InitialLogData, Service } from '../Models/Logger/types';

dotenv.config();

appinsights.setup(process.env.INSTRUMENTATION_KEY).start();

const valueToString = (value: any) => {
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
}

export const formatParameters = (parameters: Object) => {
    const indexedParametrs : {[index: string] : any} = {...parameters};
    const flatParametrs = Object.keys(indexedParametrs).map(key => `${key}: ${valueToString(indexedParametrs[key as string])}`).join(', ');
    return `{${flatParametrs}}`
}

export const launchingDBRequestLog = (parameters?: Object): string => {
    let log = 'launching DB request';
    if (parameters) log = log.concat(` with parameters: ${formatParameters(parameters)}`);
    return log;
}

export const validDBResponseLog : string = 'DB response is successful';

export const invalidDBResponseLog = (errorMessage: string) : string => `got errors on graphql API ${errorMessage}`;
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
                        service: Service.SERVER,
                        ...initialLog,
                        ...messageFromMethod,
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

    setup(logData: InitialLogData) {
        return {
            info: (step: string, severity: Severity) => this.info({ ...logData, step, severity }),
            warn: (step: string, severity: Severity) => this.warning({ ...logData, step, severity }),
            error: (step: string, severity: Severity) => this.error({ ...logData, step, severity })
        }
    }

}

const logger: Logger = new Logger();

export default logger;