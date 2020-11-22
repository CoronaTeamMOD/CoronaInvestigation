import logger from '../Logger/Logger';
import { httpRequest } from '../HTTPRequest';
import { Severity, Service } from '../Models/Logger/types';

require('dotenv').config();

export const sendSavedInvestigationToIntegration = (epidemiologyNumber: number, workflow: string, userId: string) => {
    const sendSavedInvestigationToIntegrationLogger = logger.setup({
        workflow,
        user: userId,
        investigation: epidemiologyNumber
    });
    sendSavedInvestigationToIntegrationLogger.info('checking if there is need to send the integration request', Severity.LOW)
    if (process.env.ENVIRONMENT === 'prod' || process.env.ENVIRONMENT === 'test' || (process.env.ENVIRONMENT === 'dev' && process.env.INTERFACES_INTEGRATION_API !== undefined)) {
        sendSavedInvestigationToIntegrationLogger.info('sending the http request to integration API', Severity.LOW)
        httpRequest(process.env.INTERFACES_INTEGRATION_API, 'POST', {
            idARR: [epidemiologyNumber]
        }).then(() => {
            sendSavedInvestigationToIntegrationLogger.info('sent the epidemiology number to integration successfully', Severity.LOW)
        }).catch((error) => {
            sendSavedInvestigationToIntegrationLogger.error(`failed to send investigation to integration due to: ${error}`, Severity.HIGH)
        })
    }
}