import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import GetAllCountiesResponse from '../../Models/User/GetAllCountiesResponse';
import { GET_COUNTY_DISPLAY_NAME_BY_USER, GET_ALL_COUNTIES } from '../../DBService/Counties/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const countiesRoute = Router();

countiesRoute.get('', (request: Request, response: Response) => {
    const getCountiesLogger = logger.setup({
        workflow: 'query all counties',
    });
    graphqlRequest(GET_ALL_COUNTIES, response.locals)
        .then((result: GetAllCountiesResponse) => {
            getCountiesLogger.info(validDBResponseLog, Severity.LOW);
            const counties = result.data.allCounties.nodes.map((county: any) => ({
                id: county.id,
                displayName: county.displayName,
                district: county.districtByDistrictId.displayName
            }));
            response.send(counties);
        })
        .catch((error) => {
            getCountiesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});


countiesRoute.get('/county/displayName', (request: Request, response: Response) => {
    const countyByUserLogger = logger.setup({
        workflow: 'query county display name by user',
        user: response.locals.user.id
    });

    const paramertes = { id: +response.locals.user.investigationGroup };
    countyByUserLogger.info(launchingDBRequestLog(paramertes), Severity.LOW);

    graphqlRequest(GET_COUNTY_DISPLAY_NAME_BY_USER, response.locals, paramertes)
        .then(result => {
            countyByUserLogger.info(validDBResponseLog, Severity.LOW);
            return response.send(result?.data?.countyById?.displayName as string);
        })
        .catch(error => {
            countyByUserLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

export default countiesRoute;
