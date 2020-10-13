import { Router, Request, Response } from 'express';

import User from '../../Models/User/User';
import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import UserAdminResponse from '../../Models/UserAdminResponse/UserAdminResponse';
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR } from '../../DBService/Users/Mutation';
import { GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ALL_GROUP_USERS, GET_ADMINS_OF_COUNTY } from '../../DBService/Users/Query';
import {Service, Severity} from "../../../../client/src/models/Logger";

const usersRoute = Router();
const RESPONSE_ERROR_CODE = 500;

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data?.userById)
                response.send(result.data?.userById);
            else
                response.status(400).send(`Couldn't find the user nor get its status`);
        })
        .catch(error => response.status(RESPONSE_ERROR_CODE).send('Error while trying to fetch isActive user status'))
})

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id, isActive: request.body.isActive })
        .then((result: any) => {
            if (result.data.updateUserById)
                response.send(result.data.updateUserById.user);
            else
                response.status(400).send(`Couldn't find the user nor update the status`);

        })
        .catch(error => response.status(RESPONSE_ERROR_CODE).send('Error while trying to activate / deactivate user'))
})

usersRoute.get('/user', (request: Request, response: Response) => {
    graphqlRequest(GET_USER_BY_ID, response.locals, { id: response.locals.user.id })
        .then((result: any) => response.send(result.data));
});

usersRoute.post('/changeInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(UPDATE_INVESTIGATOR, response.locals, {
        epidemiologyNumber: request.body.epidemiologyNumber,
        newUser: request.body.user
    }).then((result: any) => response.send(result.data))
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'GraphQL POST request to the DB',
                step: error
            });
            response.status(RESPONSE_ERROR_CODE).send('error in changing investigator')
        })
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

usersRoute.post('/changeCounty', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_ADMINS_OF_COUNTY, response.locals, {requestedCounty: request.body.updatedCounty})
        .then((result: any) => {
            let userAdmin = '';
            if (result && result.data && result.data.allUsers) {
                const activeUsers = result.data.allUsers.nodes.filter((user: UserAdminResponse) => user.isActive);
                activeUsers.length > 0 ? userAdmin = activeUsers[0].id : userAdmin = result.data.allUsers[0].id;
            }
            graphqlRequest(UPDATE_INVESTIGATOR, response.locals, {
                epidemiologyNumber: request.body.epidemiologyNumber,
                newUser: userAdmin
            }).then((result: any) => response.send(result.data)).catch((error) => {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'GraphQL POST request to the DB',
                    step: error
                });
                response.status(RESPONSE_ERROR_CODE).send('error while changing county');
            });
        }).catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'GraphQL POST request to the DB',
                step: error
            });
            response.status(RESPONSE_ERROR_CODE).send('error while changing county');
    })
});

export default usersRoute;
