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

exposureRoute.post('/updateExposures', (request: Request, response: Response) => {
    const { exposures, investigationId } = request.body;
    console.log(JSON.stringify(request.body));
    response.send(investigationId);
//    return graphqlRequest(CREATE_EXPOSURE, response.locals, {exposures, investigationId})
//         .then((result: any) => response.send(result))
//         .catch(error => response.status(500).json({error: 'failed to save exposures'}))
});

// exposureRoute.put('/', (request: Request, response: Response) => {
//     console.log(request.body);
//     const { exposures, investigationId } = request.body;
//     response.send('hey');
//     return graphqlRequest(UPDATE_EXPOSURE, response.locals, {exposures, investigationId,})
//             .then((result: any) => response.send(result))
//             .catch(error => response.status(500).json({error: 'failed to update exposures'}))
// });

export default exposureRoute;