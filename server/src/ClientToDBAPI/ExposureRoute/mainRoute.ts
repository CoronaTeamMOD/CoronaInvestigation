import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';
import { UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_EXPOSURE_INFO, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch exposures'}))
);

exposureRoute.post('/updateExposures', (request: Request, response: Response) => {
    return graphqlRequest(UPDATE_EXPOSURES, response.locals, {
        inputExposures: JSON.stringify(request.body)
    })
        .then((result: any) => response.send(result))
        .catch(error => {
            console.log(error);
            response.status(500).json({error: 'failed to save exposures'});
        })
});

export default exposureRoute;