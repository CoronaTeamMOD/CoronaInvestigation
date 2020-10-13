import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import User from '../../Models/User/User';
import UserAdminResponse from '../../Models/UserAdminResponse/UserAdminResponse';
import { Service, Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import CreateUserResponse from '../../Models/User/CreateUserResponse';
import GetAllSourceOrganizations from '../../Models/User/GetAllSourceOrganizations';
import { GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ALL_GROUP_USERS,
         GET_ALL_LANGUAGES, GET_ALL_SOURCE_ORGANIZATION, GET_ADMINS_OF_COUNTY } from '../../DBService/Users/Query';
import GetAllLanguagesResponse, { Language } from '../../Models/User/GetAllLanguagesResponse';
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR, CREATE_USER } from '../../DBService/Users/Mutation';

const usersRoute = Router();
const RESPONSE_ERROR_CODE = 500;
const badRequestStatusCode = 400;

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data?.userById)
                response.send(result.data?.userById);
            else
                response.status(badRequestStatusCode).send(`Couldn't find the user nor get its status`);
        })
        .catch(error => response.status(RESPONSE_ERROR_CODE).send('Error while trying to fetch isActive user status'))
})

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id, isActive: request.body.isActive })
        .then((result: any) => {
            if (result.data.updateUserById)
                response.send(result.data.updateUserById.user);
            else
                response.status(badRequestStatusCode).send(`Couldn't find the user nor update the status`);

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
})

usersRoute.get('/sourcesOrganization', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_SOURCE_ORGANIZATION, response.locals)
        .then((result: GetAllSourceOrganizations) => {
            if (result?.data?.allSourceOrganizations?.nodes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'All Sources Organizations Query',
                    step: `Queried all sources organizations successfully`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.send(result.data.allSourceOrganizations.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Sources Organizations Query',
                    step: `couldnt query all sources organizations due to ${result.errors[0].message}`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all sources organizations`);
            }
        })
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'All Sources Organizations Query',
                step: `couldnt query all sources organizations due to ${error}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all sources organizations`);
        })
})

usersRoute.get('/languages', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_LANGUAGES, response.locals)
        .then((result: GetAllLanguagesResponse) => {
            if (result?.data?.allLanguages?.nodes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'All Sources Organizations Query',
                    step: `Queried all languages successfully`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.send(result.data.allLanguages.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Languages Query',
                    step: `couldnt query all languages due to ${result.errors[0].message}`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all languages`);
            }
        })
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'All Languages Query',
                step: `couldnt query all languages due to ${error}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all languages`);
        })
})

const convertUserToDB = (clientUserInput: any) : User => {
    return { 
    ...clientUserInput,
        investigationGroup: +clientUserInput.investigationGroup,
        fullName: clientUserInput.fullName.firstName + ' ' +  clientUserInput.fullName.lastName,
        languages: clientUserInput.languages?.map((language: Language) => language.displayName)
    }
}

usersRoute.post('/createUser', (request: Request, response: Response) => {
    const newUser : User = convertUserToDB(request.body);
    graphqlRequest(CREATE_USER, response.locals, {input: newUser})
        .then((result: CreateUserResponse) => {
            if (result?.data?.createNewUser) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Create User',
                    step: `the user ${JSON.stringify(newUser)} was created successfully`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.send(result.data.createNewUser);
            }
            else  {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'Create User',
                    step: `the user ${JSON.stringify(newUser)} wasn't created due to ${result.errors[0].message}`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't create investigator`)
            };
        })
        .catch((error) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'Create User',
                step: `the user ${JSON.stringify(newUser)} wasn't created due to ${error}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to create investigator')
        });
});

export default usersRoute;
