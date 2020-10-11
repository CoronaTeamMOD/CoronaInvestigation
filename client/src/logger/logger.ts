import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { MethodsLogMessage, LogMessage, LogType, Environment } from 'models/Logger';

class Logger {
    
    _applicationInsights: ApplicationInsights;

    constructor () {
        this._applicationInsights = new ApplicationInsights({
            config: {
                instrumentationKey: process.env.REACT_APP_INSTRUMENTATION_KEY
            }
        })
        this._applicationInsights.loadAppInsights();
    }

    _postToAzure(logMessage: LogMessage) {
        this._applicationInsights.appInsights.trackEvent({
            name: logMessage.workflow + ', ' + logMessage.step,
            properties: logMessage
        })
    }

    _buildLogMessage(partialLogMessage: MethodsLogMessage, logType: LogType) {
        const logMessage: LogMessage = {
            ...partialLogMessage,
            environment: process.env.REACT_APP_ENVIRONMENT as Environment,
            timestamp: new Date().toLocaleString('he-IL'),
            type: logType
        }
        console.log(JSON.stringify(logMessage));
        if (JSON.parse(process.env.REACT_APP_SHOULD_POST_TO_AZURE as string)) {
            this._postToAzure(logMessage);
        }
    }
    
    info(logMessage: MethodsLogMessage) {
        this._buildLogMessage(logMessage, LogType.INFO)
    }

    warn(logMessage: MethodsLogMessage) {
        this._buildLogMessage(logMessage, LogType.WARNING)
    }

    error(logMessage: MethodsLogMessage) {
        this._buildLogMessage(logMessage, LogType.ERROR)
    }
}

const logger: Logger = new Logger();

export default logger;