import { Request, Response } from 'express';

import { Severity } from '../../../Models/Logger/types';
import { ADD_FLIGHT } from '../../../DBService/Airlines/Mutation.ts';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../../Logger/Logger';

const addFlight = (req : Request , res : Response) => {
    const addFlightLogger = logger.setup({
        workflow: 'add new flight to DB',
        investigation: res.locals.epidemiologynumber,
        user: res.locals.user.id
    });
    const paramaters = {
        airlineId: req.body.flightCompanyId,
        displayName: req.body.newFlightNumber
    };

    addFlightLogger.info(launchingDBRequestLog(paramaters), Severity.LOW);
    graphqlRequest(ADD_FLIGHT, res.locals, paramaters)
        .then((result: any) => {
            addFlightLogger.info(validDBResponseLog, Severity.LOW);

            const data = result.data;
            res.send(data);
        })
        .catch(error => {
            addFlightLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            res.status(errorStatusCode).send(error);
        });
};

export default addFlight;