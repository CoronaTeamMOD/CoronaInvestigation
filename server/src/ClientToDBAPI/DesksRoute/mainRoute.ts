import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import GetAllDesks from '../../Models/Desk/GetAllDesks';
import { ALL_DESKS_QUERY } from '../../DBService/Desk/Query';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const router = Router();

router.get('/', (request: Request, response: Response) => {
    const desksLogger = logger.setup({
        workflow: 'query all desks',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    desksLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(ALL_DESKS_QUERY, response.locals)
    .then((result: GetAllDesks) => {
        desksLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allDesks.nodes);
    })
    .catch(error => {
        desksLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    })
});
export default router;