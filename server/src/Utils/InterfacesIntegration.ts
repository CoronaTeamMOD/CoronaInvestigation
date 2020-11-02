import logger from '../Logger/Logger';
import { httpRequest } from '../HTTPRequest';
import { Severity, Service } from '../Models/Logger/types';

require('dotenv').config();

export const sendSavedInvestigationToIntegration = (epidemiologyNumber: number, workflow: string, userId: string) =>
{
    if (process.env.ENVIRONMENT === 'prod' || process.env.ENVIRONMENT === 'test') {
        httpRequest(process.env.INTERFACES_INTEGRATION_API, 'POST', {
            variables: {
                idARR: [epidemiologyNumber]
            }
        }).then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow,
                step: 'sent the epidemiology number to integration successfully',
                user: userId,
                investigation: epidemiologyNumber
            });
        }).catch((error) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow,
                step: `failed to send investigation to integration due to: ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
        })
    }
}