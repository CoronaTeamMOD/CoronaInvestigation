import { httpRequest } from '../HTTPRequest';

require('dotenv').config();

const apiUrl = process.env.ENVIRONMENT === 'prod' ? process.env.INTERFACES_INTEGRATION_API_PROD : process.env.INTERFACES_INTEGRATION_API_TEST;

export const sendSavedInvestigationToIntegration = (epidemiologyNumber: number) =>
    httpRequest(apiUrl, 'POST', {
        variables: {
            idARR: [epidemiologyNumber]
        }
    }).then((result) => {
        return result;
    })