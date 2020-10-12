import { Router, Request, Response } from 'express';

import User from '../../Models/User/User';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import CreateUserResponse from '../../Models/User/CreateUserResponse';
import GetAllCountiesResponse from '../../Models/User/GetAllCountiesResponse';
import { GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ALL_GROUP_USERS, GET_ALL_COUNTIES } from '../../DBService/Users/Query';
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR, CREATE_INVESTIGATOR } from '../../DBService/Users/Mutation';

const usersRoute = Router();

const errorStatusCode = 500;
const badRequestStatusCode = 400;

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data?.userById)
                response.send(result.data?.userById);
            else
                response.status(badRequestStatusCode).send(`Couldn't find the user nor get its status`);
        })
        .catch(error => response.status(errorStatusCode).send('Error while trying to fetch isActive user status'))
})

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id, isActive: request.body.isActive })
        .then((result: any) => {
            if (result.data.updateUserById)
                response.send(result.data.updateUserById.user);
            else
                response.status(badRequestStatusCode).send(`Couldn't find the user nor update the status`);

        })
        .catch(error => response.status(errorStatusCode).send('Error while trying to activate / deactivate user'))
})

usersRoute.get('/user', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_BY_ID, response.locals, { id: response.locals.user.id })
        .then((result: any) => response.send(result.data));
});

usersRoute.post('/changeInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(UPDATE_INVESTIGATOR, response.locals, { epidemiologyNumber: request.body.epidemiologyNumber, newUser: request.body.user })
        .then((result: any) => response.send(result.data));
});

usersRoute.get('/group', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_GROUP_USERS, response.locals, { investigationGroup: +response.locals.user.group })
        .then((result: any) => {
            let users: User[] = [];
            if (result && result.data && result.data.allUsers) {
                users = result.data.allUsers.nodes.map((user: User) => ({
                    ...user,
                    token: ''
                }));
            }
            return response.send(users);
        });
});

usersRoute.get('/counties', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_COUNTIES, response.locals)
        .then((result: GetAllCountiesResponse) => {
            if (result?.data?.allCounties?.nodes)
                response.send(result.data.allCounties.nodes);
            else  response.status(errorStatusCode).send(`Couldn't query all counties`);
        })
        .catch((error) => response.status(errorStatusCode).send('Error while trying to query all counties'));
});

usersRoute.post('/createInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(CREATE_INVESTIGATOR, response.locals, { ...request.body })
        .then((result: CreateUserResponse) => {
            if (result?.data?.createUser)
                response.send(result.data.createUser);
            else  response.status(errorStatusCode).send(`Couldn't create investigator`);
        })
        .catch((error) => response.status(errorStatusCode).send('Error while trying to create investigator'));
});

export default usersRoute;
