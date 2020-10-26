import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { GET_ALL_DISTRICTS } from '../../DBService/Districts/Query';
import GetAllDistrictsResponse from '../../Models/User/GetAllDistrictsResponse';

const districtsRoute = Router();
const errorStatusCode = 500;

districtsRoute.get('', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_DISTRICTS, response.locals)
        .then((result: GetAllDistrictsResponse) => {
            if (result?.data?.allDistricts?.nodes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'All c Query',
                    step: `Queried all districts successfully`,
                })
                response.send(result.data.allDistricts.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Districts Query',
                    step: `couldnt query all districts due to ${result.errors[0].message}`,
                })
                response.status(errorStatusCode).send(`Couldn't query all districts`);
            }
        })
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'All Districts Query',
                step: `couldnt query all districts due to ${error}`,
            })
            response.status(errorStatusCode).send(`Couldn't query all districts`);
        });
});

export default districtsRoute;
