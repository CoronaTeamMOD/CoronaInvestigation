import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_PERSONAL_DETAILS } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.get('/allDetails', (request: Request, response: Response) => {
    graphqlRequest(GET_PERSONAL_DETAILS, { epidemioligyNumber: Number(request.query.epidemioligyNumber) })
    .then((result: any) => response.send(result.data));
});

export default personalDetailsRoute;