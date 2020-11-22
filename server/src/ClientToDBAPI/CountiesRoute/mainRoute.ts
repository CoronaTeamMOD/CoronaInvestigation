import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { GET_COUNTY_DISPLAY_NAME_BY_USER, GET_ALL_COUNTIES } from '../../DBService/Counties/Query';
import GetAllCountiesResponse from '../../Models/User/GetAllCountiesResponse';

const countiesRoute = Router();
const errorStatusCode = 500;

countiesRoute.get('', (request: Request, response: Response) => {
    const getCountiesLogger = logger.setup({
        workflow: 'All Counties Query',
    });
    graphqlRequest(GET_ALL_COUNTIES, response.locals)
        .then((result: GetAllCountiesResponse) => {
            if (result?.data?.allCounties?.nodes) {
                getCountiesLogger.info('Queried all counties successfully', Severity.LOW)
                let counties = result.data.allCounties.nodes.map((county: any) => ({
                    id: county.id,
                    displayName: county.displayName,
                    district: county.districtByDistrictId.displayName
                }));
                response.send(counties);
            } else {
                getCountiesLogger.error(`couldnt query all counties due to ${result.errors[0].message}`, Severity.CRITICAL)
                response.status(errorStatusCode).send(`Couldn't query all counties`);
            }
        })
        .catch((error) => {
            getCountiesLogger.error(`couldnt query all counties due to ${error}`, Severity.CRITICAL)
            response.status(errorStatusCode).send(`Couldn't query all counties`);
        });
});


countiesRoute.get('/county/displayName', (request: Request, response: Response) => {
    const countyByUserLogger = logger.setup({
        workflow: 'Fetching county display name by user',
        user: response.locals.user.id
    });
    countyByUserLogger.info('launching DB request', Severity.LOW)
    graphqlRequest(GET_COUNTY_DISPLAY_NAME_BY_USER, response.locals, { id: +response.locals.user.investigationGroup })
        .then((result: any) => {
            countyByUserLogger.info('Got response from DB', Severity.LOW)
            return response.send(result?.data?.countyById?.displayName as string);
        })
        .catch(err => {
            countyByUserLogger.error(`error while trying fetch displayName due to ${err}`, Severity.CRITICAL)
            response.status(errorStatusCode).send(`Couldn't query county display name`);
        });
});

export default countiesRoute;
