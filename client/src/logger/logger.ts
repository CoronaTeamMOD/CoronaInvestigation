import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { MethodsLogMessage, LogMessage, LogType, Environment, InitialLogData, Severity, Service } from 'models/Logger';
import { store } from 'redux/store';

class Logger {

    _applicationInsights: ApplicationInsights;

    constructor() {
        if (process.env.REACT_APP_INSTRUMENTATION_KEY) {
            this._applicationInsights = new ApplicationInsights({
                config: {
                    instrumentationKey: process.env.REACT_APP_INSTRUMENTATION_KEY
                }
            });
        } else {
            this._applicationInsights = new ApplicationInsights({
                config: {
                    instrumentationKey: 'xxxx'
                }
            });
        }
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
            service: Service.CLIENT,
            ...partialLogMessage,
            environment: process.env.REACT_APP_ENVIRONMENT as Environment,
            timestamp: new Date().toLocaleString('he-IL'),
            type: logType,
        }
        if (process.env.REACT_APP_SHOULD_POST_TO_AZURE && JSON.parse(process.env.REACT_APP_SHOULD_POST_TO_AZURE as string)) {
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

    setup(workflow: string) {
        const storeState = store.getState();
        const userId = storeState.user.data.id;
        const epidemiologyNumber = storeState.investigation.epidemiologyNumber;
        return {
            info: (step: string, severity: Severity) => this.info({
                workflow,
                user: userId,
                investigation: epidemiologyNumber,
                step,
                severity
            }),
            warn: (step: string, severity: Severity) => this.warn({
                workflow,
                user: userId,
                investigation: epidemiologyNumber,
                step,
                severity
            }),
            error: (step: string, severity: Severity) => this.error({
                workflow,
                user: userId,
                investigation: epidemiologyNumber,
                step,
                severity
            })
        }
    }

    setupVerbose(logData: InitialLogData) {
        return {
            info: (step: string, severity: Severity) => this.info({ ...logData, step, severity }),
            warn: (step: string, severity: Severity) => this.warn({ ...logData, step, severity }),
            error: (step: string, severity: Severity) => this.error({ ...logData, step, severity })
        }
    }
}

const logger: Logger = new Logger();

export default logger;