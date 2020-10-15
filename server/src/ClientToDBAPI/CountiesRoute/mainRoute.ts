import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import {GET_COUNTY_DISPLAY_NAME_BY_USER, GET_ALL_COUNTIES} from '../../DBService/Counties/Query';
import GetAllCountiesResponse from '../../Models/User/GetAllCountiesResponse';

const countiesRoute = Router();
const errorStatusCode = 500;

countiesRoute.get('', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_COUNTIES, response.locals)
        .then((result: GetAllCountiesResponse) => {
            if (result?.data?.allCounties?.nodes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'All Counties Query',
                    step: `Queried all counties successfully`,
                })
                response.send(result.data.allCounties.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Counties Query',
                    step: `couldnt query all counties due to ${result.errors[0].message}`,
                })
                response.status(errorStatusCode).send(`Couldn't query all counties`);
            }
        })
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'All Counties Query',
                step: `couldnt query all counties due to ${error}`,
            })
            response.status(errorStatusCode).send(`Couldn't query all counties`);
        });
});


countiesRoute.get('/county/displayName', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching county display name by user',
        step: 'launching DB request',
        user: response.locals.user.id
    });
    graphqlRequest(GET_COUNTY_DISPLAY_NAME_BY_USER, response.locals, { id: +response.locals.user.investigationGroup })
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Fetching county display name by user',
                step: 'Got response from DB',
                user: response.locals.user.id
            });
            return response.send(result?.data?.countyById?.displayName as string);
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'Fetching county display name by user',
                step: `error while trying fetch displayName due to ${err}`,
            });
            response.status(errorStatusCode).send(`Couldn't query county display name`);
        });
});

export default countiesRoute;
