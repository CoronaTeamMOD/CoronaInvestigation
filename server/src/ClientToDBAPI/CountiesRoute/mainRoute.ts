import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import {GET_COUNTY_DISPLAY_NAME_BY_USER} from '../../DBService/Counties/Query';
import { Service, Severity } from '../../Models/Logger/types';
import logger from '../../Logger/Logger';

const countiesRoute = Router();

countiesRoute.get('/county/displayName', adminMiddleWare, (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching county display name by user',
        step: 'launching DB request',
        user: response.locals.user.id
    });
    graphqlRequest(GET_COUNTY_DISPLAY_NAME_BY_USER, response.locals, { id: +response.locals.user.group })
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Fetching county display name by user',
                step: 'Got response from DB',
                user: response.locals.user.id
            });
            return response.send(result.data.countyById.displayName as string);
        });
});

export default countiesRoute;
