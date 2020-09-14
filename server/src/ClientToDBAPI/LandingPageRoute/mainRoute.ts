import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_USER_INVESTIGATIONS} from '../../DBService/LandingPage/Query';
const landingPageRoute = Router();

landingPageRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Landing page route');
})

landingPageRoute.post('/investigations', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, { userName: response.locals.user.name })
    .then((result: any) => response.send(result))
    .catch(err => response.status(500).send('error in fetching data: ' + err));
})

export default landingPageRoute;