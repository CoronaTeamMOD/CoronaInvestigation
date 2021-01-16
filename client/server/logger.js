const appinsights = require('applicationinsights');

const { createLogger, transports, format } = require('winston');

require('dotenv').config();

appinsights.setup(process.env.INSTRUMENTATION_KEY).start();

const REVERSE_PROXY_SERVICE = 'Reverse Proxy';

const LoggerUtils = {
    Severity: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical',
    }
}

class Logger {
    
    constructor() {
        this.logger = createLogger({
            transports: [
                new transports.Console()
            ],
            format: format.combine(
                format.timestamp(),
                format.printf(info => {
                    const initialLog = { 
                        type: info.level, 
                        timestamp: new Date(info.timestamp).toLocaleString('he-IL') ,
                        environment: process.env.ENVIRONMENT
                    };
                    const messageFromMethod = JSON.parse(JSON.stringify(info.message));
                    const outputLog = {
                        service: REVERSE_PROXY_SERVICE,
                        ...initialLog,
                        ...messageFromMethod,
                    }
                    this._postToAzure(outputLog);
                    return JSON.stringify(outputLog);
                })
            )
        });
    }

    _postToAzure(logMessage) {
        appinsights.defaultClient.trackEvent({
            name: logMessage.workflow + ', ' + logMessage.step,
            properties: logMessage
        })
    }

    warning(logMessage) {
        this.logger.warn(logMessage);
    }

    error(logMessage) {
        this.logger.error(logMessage);
    }

    info(logMessage) {
        this.logger.info(logMessage);
    }
}

module.exports = {
    logger: new Logger(),
    ...LoggerUtils
}