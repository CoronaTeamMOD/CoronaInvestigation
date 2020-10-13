import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import {GET_USER_INVESTIGATIONS, GET_GROUP_INVESTIGATIONS, GET_ALL_COUNTIES} from '../../DBService/LandingPage/Query';

const landingPageRoute = Router();

landingPageRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Landing page route');
})

landingPageRoute.get('/investigations', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, { userId: response.locals.user.id, orderBy: request.query.orderBy })
        .then((result: any) => {
            if (result && result.data && result.data.userInvestigationsSort &&
                result.data.userInvestigationsSort.json) {
                response.send(JSON.parse(result.data.userInvestigationsSort.json))
            }
            else {
                response.status(500).send('error in fetching data')
            }
        })
        .catch(err => {
            response.status(500).send('error in fetching data: ' + err);
        });
})

landingPageRoute.get('/groupInvestigations', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_GROUP_INVESTIGATIONS, response.locals, { investigationGroupId: +response.locals.user.group, orderBy: request.query.orderBy  })
        .then((result: any) => {
            if (result && result.data && result.data.groupInvestigationsSort &&
                result.data.groupInvestigationsSort.json) {
                response.send(JSON.parse(result.data.groupInvestigationsSort.json))
            }
            else {
                console.log(result);
                response.status(500).send('error in fetching data')
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).send('error in fetching data: ' + err)
        });
});


export default landingPageRoute;