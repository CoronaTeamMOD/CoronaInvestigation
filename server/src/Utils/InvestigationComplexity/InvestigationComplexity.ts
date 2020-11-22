import { Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Severity } from '../../Models/Logger/types';
import { CALC_INVESTIGATION_COMPLEXITY } from '../../DBService/PersonalDetails/Mutation';

const errorStatusCode = 500;

export const calculateInvestigationComplexity = (request: Request, response: Response, workflowLocation: string) => {
    const calculateInvestigationComplexityLogger = logger.setup({
        workflow: `Saving ${workflowLocation}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
        .then((result: any) => {
            if (result.data) {
                calculateInvestigationComplexityLogger.info('calced investigation complexity by patient info successfully', Severity.LOW);
                response.send({ message: `saved ${workflowLocation} and calced complexity successfully` });
            }
            else {
                return Promise.reject(JSON.stringify(result));
            }
        }).catch(err => {
            calculateInvestigationComplexityLogger.error(`error in requesting graphql API request in CALC_INVESTIGATION_COMPLEXITY request due to ${err}`, Severity.HIGH);
            graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
                .then((result: any) => {
                    if (result.data) {
                        calculateInvestigationComplexityLogger.info('calced investigation complexity by patient info successfully on the second time', Severity.LOW);
                        response.send({ message: `saved ${workflowLocation} and calced complexity successfully` });
                    }
                    else {
                        return Promise.reject(JSON.stringify(result));
                    }
                }).catch(err => {
                    calculateInvestigationComplexityLogger.error(`error again in requesting graphql API request in CALC_INVESTIGATION_COMPLEXITY request due to ${err}`, Severity.HIGH);
                    response.status(errorStatusCode).json({ message: 'failed to calc the investigations complexity' });
                });
        });
}