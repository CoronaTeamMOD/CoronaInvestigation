import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_EXPOSURE_INFO, {investigationId : parseInt(request.params.investigationId)})
    .then((result: any) => response.send(result));
})

export default exposureRoute;