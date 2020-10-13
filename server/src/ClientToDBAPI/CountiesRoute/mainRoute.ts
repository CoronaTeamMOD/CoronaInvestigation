import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import landingPageRoute from '../LandingPageRoute/mainRoute';
import { Service, Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_ALL_COUNTIES } from '../../DBService/LandingPage/Query';
import {GET_COUNTY_DISPLAY_NAME_BY_USER} from '../../DBService/Counties/Query';

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

countiesRoute.get('/allCounties', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_COUNTIES, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'GET request to the DB',
            step: 'Fetching all counties',
            user: response.locals.user.id
        });
        response.send(result)
    }).catch((err) => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'GET request to the DB',
            step: 'Fetching all counties',
            user: response.locals.user.id
        });
        response.status(500).send('error in fetching data: ' + err)
    });
});

export default countiesRoute;
