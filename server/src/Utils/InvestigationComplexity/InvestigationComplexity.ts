import { Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { CALC_INVESTIGATION_COMPLEXITY } from '../../DBService/PersonalDetails/Mutation';

const errorStatusCode = 500;

export const calculateInvestigationComplexity = (request: Request, response: Response, workflowLocation: string) => {
    graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
        .then((result: any) => {
            if (result.data) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: `Saving ${workflowLocation}`,
                    step: 'calced investigation complexity by patient info successfully',
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                });
                response.send({ message: `saved ${workflowLocation} and calced complexity successfully` });
            }
            else {
                return Promise.reject(JSON.stringify(result));
            }
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: `Saving ${workflowLocation}`,
                step: 'error in requesting graphql API request in CALC_INVESTIGATION_COMPLEXITY request due to ' + err,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
                .then((result: any) => {
                    if (result.data) {
                        logger.info({
                            service: Service.SERVER,
                            severity: Severity.LOW,
                            workflow: `Saving ${workflowLocation}`,
                            step: 'calced investigation complexity by patient info successfully on the second time',
                            investigation: response.locals.epidemiologynumber,
                            user: response.locals.user.id
                        });
                        response.send({ message: `saved ${workflowLocation} and calced complexity successfully` });
                    }
                    else {
                        return Promise.reject(JSON.stringify(result));
                    }
                }).catch(err => {
                    logger.error({
                        service: Service.SERVER,
                        severity: Severity.HIGH,
                        workflow: `Saving ${workflowLocation}`,
                        step: 'error again in requesting graphql API request in CALC_INVESTIGATION_COMPLEXITY request due to ' + err,
                        investigation: response.locals.epidemiologynumber,
                        user: response.locals.user.id
                    });
                    response.status(errorStatusCode).json({ message: 'failed to calc the investigations complexity' });
                });
        });
}