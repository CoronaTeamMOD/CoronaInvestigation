import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_USER_INVESTIGATIONS, GET_USER_BY_ID, GET_GROUP_INVESTIGATIONS} from '../../DBService/LandingPage/Query';
const landingPageRoute = Router();

landingPageRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Landing page route');
})

landingPageRoute.post('/investigations', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, { userId: response.locals.user.id })
    .then((result: any) => {
        response.send(result)
    })
    .catch(err => response.status(500).send('error in fetching data: ' + err));
})

landingPageRoute.get('/groupInvestigations', (request: Request, response: Response) => {
    graphqlRequest(GET_GROUP_INVESTIGATIONS, response.locals, { investigationGroupId:  +request.query.investigationGroup })
    .then((result: any) => {
        response.send(result)
    })
    .catch(err => response.status(500).send('error in fetching data: ' + err));
})


export default landingPageRoute;