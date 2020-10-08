import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_USER_INVESTIGATIONS, GET_USER_BY_ID, GET_GROUP_INVESTIGATIONS } from '../../DBService/LandingPage/Query';
const landingPageRoute = Router();

landingPageRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Landing page route');
})

landingPageRoute.get('/investigations', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, { userId: response.locals.user.id })
        .then((result: any) => {
            if (result && result.data && result.data.userInvestigationsByDateAndPriority &&
                result.data.userInvestigationsByDateAndPriority.json) {
                response.send(JSON.parse(result.data.userInvestigationsByDateAndPriority.json))
            }
            else {
                response.status(500).send('error in fetching data')
            }
        })
        .catch(err => response.status(500).send('error in fetching data: ' + err));
})

landingPageRoute.get('/groupInvestigations', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_GROUP_INVESTIGATIONS, response.locals, { investigationGroupId: +response.locals.user.group })
        .then((result: any) => {
            if (result && result.data && result.data.groupInvestigationsByDateAndPriority &&
                result.data.groupInvestigationsByDateAndPriority.json) {
                response.send(JSON.parse(result.data.groupInvestigationsByDateAndPriority.json))
            }
            else {
                response.status(500).send('error in fetching data')
            }
        })
        .catch(err => response.status(500).send('error in fetching data: ' + err));
})


export default landingPageRoute;