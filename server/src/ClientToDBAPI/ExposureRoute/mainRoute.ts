import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_EXPOSURE_INFO } from '../../DBService/Exposure/Query';
import { UPDATE_EXPOSURE, CREATE_EXPOSURE } from '../../DBService/Exposure/Mutation';

const exposureRoute = Router();

exposureRoute.get('/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_EXPOSURE_INFO, request.headers, {investigationId : parseInt(request.params.investigationId)})
    .then((result: any) => response.send(result));
})

exposureRoute.post('/', (request: Request, response: Response) => {
        graphqlRequest(CREATE_EXPOSURE, request.headers, {data : parseBodyToExposureJson(request.body)})
        .then((result: any) => response.send(result));
})

exposureRoute.put('/', (request: Request, response: Response) => {
        graphqlRequest(UPDATE_EXPOSURE, request.headers, {exposureId : parseInt(request.body.id), data: parseBodyToExposureJson(request.body)})
        .then((result: any) => response.send(result));
})

const parseBodyToExposureJson = (data: any) => {
    return {
            investigationId: data.investigationId,
            exposureFirstName: data.exposureFirstName,
            exposureLastName: data.exposureLastName,
            exposureDate: data.exposureDate,
            exposureAddress: data.exposureAddress,
            exposurePlaceSubType: data.exposurePlaceSubType,
            exposurePlaceType: data.exposurePlaceType,
            flightDestinationCity: data.flightDestinationCity,
            flightDestinationAirport: data.flightDestinationAirport,
            flightOriginCity: data.flightOriginCity,
            flightOriginAirport: data.flightOriginAirport,
            flightStartDate: data.flightStartDate,
            flightEndDate: data.flightEndDate,
            airline: data.airline,
            flightNum: data.flightNum,
            flightOriginCountry: data.flightOriginCountry,
            flightDestinationCountry: data.flightDestinationCountry,
            wasAbroad: data.wasAbroad,
            wasConfirmedExposure: data.wasConfirmedExposure
    }
}
export default exposureRoute;