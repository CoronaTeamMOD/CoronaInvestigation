import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import { GET_ALL_DISTRICTS } from '../../DBService/Districts/Query';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import GetAllDistrictsResponse from '../../Models/District/GetAllDistrictsResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const districtsRoute = Router();

districtsRoute.get('', UseCache , (request: Request, response: Response) => {
    const getDistrictsLogger = logger.setup({
        workflow: 'query all districts',
    });
    getDistrictsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_DISTRICTS, response.locals)
        .then((result: GetAllDistrictsResponse) => {
            const data = result.data.allDistricts.nodes;
            getDistrictsLogger.info(validDBResponseLog, Severity.LOW);
            setToCache(request.originalUrl, data);
            response.send(data);
        })
        .catch((error) => {
            getDistrictsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

export default districtsRoute;