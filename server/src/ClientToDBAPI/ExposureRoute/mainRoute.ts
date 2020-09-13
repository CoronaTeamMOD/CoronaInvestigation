import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';
import { UPDATE_EXPOSURE, CREATE_EXPOSURE } from '../../DBService/Exposure/Mutation';
import ExposureDetails from '../../Models/Exposure/Exposure';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_EXPOSURE_INFO, response.locals,{investigationId : parseInt(request.params.investigationId)})
    .then((result: any) => response.send(result));
})

exposureRoute.post('/', (request: Request, response: Response) => {
        graphqlRequest(CREATE_EXPOSURE,
                        response.locals,
                       {data : removeExposureDetailsIdForMutation(request.body.exposureDetails)})
        .then((result: any) => response.send(result));
})

exposureRoute.put('/', (request: Request, response: Response) => {
        graphqlRequest(UPDATE_EXPOSURE,
                       response.locals,
                       {exposureId : parseInt(request.body.exposureDetails.id),
                        data: removeExposureDetailsIdForMutation(request.body.exposureDetails)})
        .then((result: any) => response.send(result));
})

const removeExposureDetailsIdForMutation = (data: ExposureDetails) => {
    const clinicalDetails: ExposureDetails = {...data};
    delete clinicalDetails.id;
    return clinicalDetails;
}

export default exposureRoute;