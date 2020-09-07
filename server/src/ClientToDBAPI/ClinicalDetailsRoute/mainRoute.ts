import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_SYMPTOMS, GET_BACKGROUND_DISEASES } from '../../DBService/ClinicalDetails/Query';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Clinical Details route');
});

clinicalDetailsRoute.post('/symptoms', (request: Request, response: Response) => {
    graphqlRequest(GET_SYMPTOMS).then((result: any) => response.send(result));
});

clinicalDetailsRoute.post('/backgroundDiseases', (request: Request, response: Response) => {
    graphqlRequest(GET_BACKGROUND_DISEASES).then((result: any) => response.send(result));
});

export default clinicalDetailsRoute;
