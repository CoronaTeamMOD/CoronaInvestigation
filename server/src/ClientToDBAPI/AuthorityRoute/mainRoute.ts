import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/useCache';
import {GET_ALL_AUTHORITIES} from '../../DBService/Authority/Query';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, validDBResponseLog, launchingDBRequestLog} from '../../Logger/Logger';

const AuthorityRoute = Router();

AuthorityRoute.get('/', UseCache,(request: Request, response: Response) => {
    const authoritiesLogger = logger.setup({
      workflow: 'query all authorities',
      investigation: response.locals.epidemiologynumber,
      user: response.locals.user.id
    });
    authoritiesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_AUTHORITIES, response.locals)
    .then((result: any) => {
      authoritiesLogger.info(validDBResponseLog, Severity.LOW);
      const data = result.data.allAuthorities.nodes
      setToCache(request.originalUrl, data);
      response.send(data);
    })
    .catch(error => {
      authoritiesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

export default AuthorityRoute;