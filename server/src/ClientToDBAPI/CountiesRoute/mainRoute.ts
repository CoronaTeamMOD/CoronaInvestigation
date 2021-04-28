import { Router, Request, Response } from 'express';

import UseCache, { setToCache } from '../../middlewares/useCache';
import { Severity } from '../../Models/Logger/types';
import { GET_ALL_COUNTIES } from '../../DBService/Counties/Query';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import GetAllCountiesResponse from '../../Models/User/GetAllCountiesResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const countiesRoute = Router();

countiesRoute.get('', UseCache,(request: Request, response: Response) => {
    const getCountiesLogger = logger.setup({
        workflow: 'query all counties',
    });
    getCountiesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_COUNTIES, response.locals)
        .then((result: GetAllCountiesResponse) => {
            getCountiesLogger.info(validDBResponseLog, Severity.LOW);
            const data = result.data.allCounties.nodes;
            setToCache(request.originalUrl, data);
            response.send(data);
        })
        .catch((error) => {
            getCountiesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

export default countiesRoute;