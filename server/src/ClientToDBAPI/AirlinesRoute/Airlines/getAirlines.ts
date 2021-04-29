import { Request, Response } from 'express';
import { Severity } from '../../../Models/Logger/types';
import { ALL_AIRLINES } from '../../../DBService/Airlines/Query';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../../Logger/Logger';
import { setToCache } from '../../../middlewares/UseCache';

const getAirlines = (req : Request , res : Response) => {
    const airlinesLogger = logger.setup({
        workflow: 'all airlines',
        investigation: res.locals.epidemiologynumber,
        user: res.locals.user.id
    });

    airlinesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(ALL_AIRLINES, res.locals)
        .then((result: any) => {
            airlinesLogger.info(validDBResponseLog, Severity.LOW);

            const data = result.data.allAirlines.nodes;
            setToCache(req.originalUrl, data);
            res.send(data);
        })
        .catch(error => {
            airlinesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            res.status(errorStatusCode).send(error);
        });
}

export default getAirlines;