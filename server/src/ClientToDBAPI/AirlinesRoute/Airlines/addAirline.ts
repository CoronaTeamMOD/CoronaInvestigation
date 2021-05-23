import { Request, Response } from 'express';

import { Severity } from '../../../Models/Logger/types';
import { ADD_AIRLINE } from '../../../DBService/Airlines/Mutation.ts';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../../Logger/Logger';

const addAirline = (req : Request , res : Response) => {
    const addAirlineLogger = logger.setup({
        workflow: 'add new airline to DB',
        investigation: res.locals.epidemiologynumber,
        user: res.locals.user.id
    });
    const paramaters = {
        displayName: req.body.flightCompany
    };

    addAirlineLogger.info(launchingDBRequestLog(paramaters), Severity.LOW);
    graphqlRequest(ADD_AIRLINE, res.locals, paramaters)
        .then((result: any) => {
            addAirlineLogger.info(validDBResponseLog, Severity.LOW);

            const data = result.data;
            res.send(data);
        })
        .catch(error => {
            addAirlineLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            res.status(errorStatusCode).send(error);
        });
};

export default addAirline;