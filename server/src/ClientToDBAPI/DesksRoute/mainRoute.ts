import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import GetAllDesks from '../../Models/Desk/GetAllDesks';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { ALL_DESKS_QUERY, DESKS_BY_COUNTY_ID } from '../../DBService/Desk/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const router = Router();

router.get('/', UseCache ,(request: Request, response: Response) => {
    const desksLogger = logger.setup({
        workflow: 'query all desks',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    desksLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(ALL_DESKS_QUERY, response.locals)
    .then((result: GetAllDesks) => {
        desksLogger.info(validDBResponseLog, Severity.LOW);
        const data = result.data.allDesks.nodes;
        setToCache(request.originalUrl, data);
        response.send(data);
    })
    .catch(error => {
        desksLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    })
});

router.post('/county', (request: Request, response: Response) => {
    const countyLogger = logger.setup({
        workflow: 'query desks by county id',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    const parameters = { countyId: request.body.countyId };
    countyLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(DESKS_BY_COUNTY_ID, response.locals, parameters)
        .then((res: GetAllDesks) => {
            countyLogger.info(validDBResponseLog, Severity.LOW);
            response.send(res.data.allDesks.nodes);
        })
        .catch(error => {
            countyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
});

export default router;