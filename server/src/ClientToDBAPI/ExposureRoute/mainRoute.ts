import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';
import { UPDATE_EXPOSURE, CREATE_EXPOSURE } from '../../DBService/Exposure/Mutation';
import ExposureDetails from '../../Models/Exposure/Exposure';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_EXPOSURE_INFO, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch exposures'}))
);

exposureRoute.post('/', (request: Request, response: Response) => {
    const { id, ...data} = request.body.exposureDetails;
   return graphqlRequest(CREATE_EXPOSURE, response.locals, {data})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save exposures'}))
});

exposureRoute.put('/', (request: Request, response: Response) => {
    const {id, ...data} = request.body.exposureDetails;
    return graphqlRequest(UPDATE_EXPOSURE, response.locals, {exposureId: id, data,})
            .then((result: any) => response.send(result))
            .catch(error => response.status(500).json({error: 'failed to update exposures'}))
    }
);

export default exposureRoute;