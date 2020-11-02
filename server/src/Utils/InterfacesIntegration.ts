import { httpRequest } from '../HTTPRequest';

require('dotenv').config();

export const sendSavedInvestigationToIntegration = (epidemiologyNumber: number) =>
    httpRequest(process.env.INTERFACES_INTEGRATION_API, 'POST', {
        variables: {
            idARR: [epidemiologyNumber]
        }
    }).then((result) => {
        return result;
    })