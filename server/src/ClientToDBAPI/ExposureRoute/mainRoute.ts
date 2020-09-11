import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';
import { UPDATE_EXPOSURE, CREATE_EXPOSURE } from '../../DBService/Exposure/Mutation';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_EXPOSURE_INFO, {investigationId : parseInt(request.params.investigationId)})
    .then((result: any) => response.send(result));
})

exposureRoute.post('/', (request: Request, response: Response) => {
    if(typeof (request.body.exposureId) === "number"){
        graphqlRequest(UPDATE_EXPOSURE, {exposureId : parseInt(request.body.exposureId), data: request.body.data})
        .then((result: any) => response.send(result));
    }
    else {
        graphqlRequest(CREATE_EXPOSURE, { data: request.body.data })
        .then((result: any) => response.send(result));
    }
})

export default exposureRoute;