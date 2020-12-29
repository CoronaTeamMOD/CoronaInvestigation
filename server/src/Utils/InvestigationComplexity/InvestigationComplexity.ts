import { Response } from 'express';

import { InitialLogData, Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, validDBResponseLog } from '../../Logger/Logger';
import { CALC_INVESTIGATION_COMPLEXITY } from '../../DBService/PersonalDetails/Mutation';

export const calculateInvestigationComplexity = (response: Response, baseLog: InitialLogData) => {
    const calculateInvestigationComplexityLogger = logger.setup({
        ...baseLog,
        workflow: `${baseLog.workflow}: calculate investigation complexity`
    });
    graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
    .then((result) => {
        calculateInvestigationComplexityLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    })
    .catch(error => {
        calculateInvestigationComplexityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        graphqlRequest(CALC_INVESTIGATION_COMPLEXITY, response.locals, { epidemiologyNumber: +response.locals.epidemiologynumber })
        .then(result => {
            calculateInvestigationComplexityLogger.info(`${validDBResponseLog} on the second time`, Severity.LOW);
            response.send(result);
        }).catch(error => {
            calculateInvestigationComplexityLogger.error(`second time: ${invalidDBResponseLog(error)}`, Severity.HIGH);
            response.status(errorStatusCode).json(error);
        });
    });
}