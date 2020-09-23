import {graphqlRequest} from "../../GraphqlHTTPRequest";
import {UPDATE_IS_USER_ACTIVE} from "../../DBService/Users/Mutation";

import { Router, Request, Response } from 'express';
import { GET_IS_USER_ACTIVE } from "../../DBService/Users/Query";

const usersRoute = Router();

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, {id: response.locals.user.id})
    .then((result:any) => {
        if (result.data?.userById)
            response.send(result.data?.userById);
        else
            response.status(400).send(`Couldn't find the user nor get its status`);
    })
    .catch(error => response.status(500).send('Error while trying to fetch isActive user status'))
})

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, {id: response.locals.user.id, isActive: request.body.isActive})
       .then((result:any) => {
        if(result.data.updateUserById)
            response.send(result.data.updateUserById.user);
        else
            response.status(400).send(`Couldn't find the user nor update the status`);

       })
       .catch(error => response.status(500).send('Error while trying to activate / deactivate user'))
})

export default usersRoute;
