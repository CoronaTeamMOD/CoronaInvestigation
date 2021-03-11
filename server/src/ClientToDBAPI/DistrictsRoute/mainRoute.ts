import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { GET_ALL_DISTRICRS } from '../../DBService/Districts/Query';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import GetAllDistrictsResponse from '../../Models/District/GetAllDistrictsResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const districtsRoute = Router();

districtsRoute.get('', (request: Request, response: Response) => {
    const getDistrictsLogger = logger.setup({
        workflow: 'query all districts',
    });
    getDistrictsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_DISTRICRS, response.locals)
        .then((result: GetAllDistrictsResponse) => {
            getDistrictsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allDistricts.nodes);
        })
        .catch((error) => {
            getDistrictsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

export default districtsRoute;