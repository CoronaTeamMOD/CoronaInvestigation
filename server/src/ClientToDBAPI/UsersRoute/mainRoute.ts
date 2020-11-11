import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import User from '../../Models/User/User';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { adminMiddleWare, superAdminMiddleWare } from '../../middlewares/Authentication';
import CreateUserResponse from '../../Models/User/CreateUserResponse';
import UserAdminResponse from '../../Models/UserAdminResponse/UserAdminResponse';
import GetAllSourceOrganizations from '../../Models/User/GetAllSourceOrganizations';
import GetAllLanguagesResponse, { Language } from '../../Models/User/GetAllLanguagesResponse';
import GetAllUserTypesResponse from '../../Models/User/GetAllUserTypesResponse'
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR, CREATE_USER, UPDATE_COUNTY_BY_USER } from '../../DBService/Users/Mutation';
import {
    GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ACTIVE_GROUP_USERS,
    GET_ALL_LANGUAGES, GET_ALL_SOURCE_ORGANIZATION, GET_ADMINS_OF_COUNTY, GET_USERS_BY_DISTRICT_ID, GET_ALL_USER_TYPES, GET_USERS_BY_COUNTY_ID
} from '../../DBService/Users/Query';

const usersRoute = Router();
const RESPONSE_ERROR_CODE = 500;
const badRequestStatusCode = 400;

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting user activity status',
        step: `make the graphql API request with parameters ${JSON.stringify({ id: response.locals.user.id })}`,
        user: response.locals.user.id
    })
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting user activity status',
                    step: 'got response from the DB',
                    user: response.locals.user.id
                })
                response.send(result.data?.userById);
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Getting user activity status',
                    step: 'didnt get data from the DB',
                    user: response.locals.user.id
                })
                response.status(badRequestStatusCode).send(`Couldn't find the user nor get its status`);
            }
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting user activity status',
                step: `failed to get response from the graphql API due to: ${error}`,
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to fetch isActive user status');
        })
})

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    const updateIsActiveStatusVariables = {
        id: response.locals.user.id,
        isActive: request.body.isActive
    }
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Updating user activity status',
        step: `make the graphql API request with parameters ${JSON.stringify(updateIsActiveStatusVariables)}`,
        user: response.locals.user.id
    })
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, updateIsActiveStatusVariables)
        .then((result: any) => {
            if (result.data.updateUserById) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Updating user activity status',
                    step: 'got response from the DB',
                    user: response.locals.user.id
                })
                response.send(result.data.updateUserById.user);
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Updating user activity status',
                    step: 'didnt get data from the DB',
                    user: response.locals.user.id
                })
                response.status(badRequestStatusCode).send(`Couldn't find the user nor update the status`);
            }
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Updating user activity status',
                step: `failed to get response from the graphql API due to: ${error}`,
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to activate / deactivate user')
        })
})

usersRoute.get('/user', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting user details',
        step: 'requesting graphql API for user details',
        user: response.locals.user.id
    });
    graphqlRequest(GET_USER_BY_ID, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting user details',
                step: 'got the result from the DB',
                user: response.locals.user.id
            });
            response.send(result.data);
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting user details',
                step: `failed to get user details from the DB due to: ${err}`,
                user: response.locals.user.id
            });
        });
});

usersRoute.post('/changeInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    const changeInvestigatorVariables = {
        epidemiologyNumber: request.body.epidemiologyNumber,
        newUser: request.body.user
    };
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Switch investigator',
        step: `querying the graphql API with parameters ${JSON.stringify(changeInvestigatorVariables)}`,
        user: response.locals.user.id
    });
    graphqlRequest(UPDATE_INVESTIGATOR, response.locals, changeInvestigatorVariables).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Switch investigator',
            step: `investigator have been changed in the DB, investigation: ${request.body.epidemiologyNumber}`,
            user: response.locals.user.id
        });
        response.send(result.data)
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Switch investigator',
            step: `querying the graphql API failed du to ${err}`,
            investigation: response.locals.epidemiologyNumber,
            user: response.locals.user.id
        });
        response.sendStatus(500);
    });
});

usersRoute.get('/userTypes', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting user types',
        step: 'querying the graphql API',
        user: response.locals.user.id
    });
    graphqlRequest(GET_ALL_USER_TYPES, response.locals)
        .then((result: GetAllUserTypesResponse) => {
            if (result?.data?.allUserTypes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting user types',
                    step: 'got user types from the DB',
                    user: response.locals.user.id
                });
                response.send(result.data.allUserTypes?.nodes)
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Getting user types',
                    step: 'didnt get data from the DB',
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get userTypes')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'Getting user types',
                step: `couldnt query all user types due to ${err}`,
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all userTypes`);
        })
})

usersRoute.get('/group', adminMiddleWare, (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Switch investigator',
        step: `querying the graphql API with parameters ${JSON.stringify({ investigationGroup: response.locals.user.investigationGroup })}`,
        user: response.locals.user.id
    });
    graphqlRequest(GET_ACTIVE_GROUP_USERS, response.locals, { investigationGroup: +response.locals.user.investigationGroup })
        .then((result: any) => {
            let users: User[] = [];
            if (result && result.data && result.data.allUsers) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting group users',
                    step: 'got group users from the DB',
                    user: response.locals.user.id
                });
                users = result.data.allUsers.nodes.map((user: User) => ({
                    ...user,
                    token: ''
                }));
            } else {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting group users',
                    step: 'didnt get group users from the DB',
                    user: response.locals.user.id
                });
            }
            return response.send(users);
        });
});

usersRoute.post('/changeCounty', adminMiddleWare, (request: Request, response: Response) => {
    let userAdmin = 'admin.group' + request.body.updatedCounty;

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'GraphQL request to the change the investigation county',
        step: `post with parameters ${JSON.stringify({ epidemiologyNumber: request.body.epidemiologyNumber, newUser: userAdmin })}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologyNumber,
    });

    graphqlRequest(UPDATE_COUNTY_BY_USER, response.locals, {
        epidemiologyNumber: request.body.epidemiologyNumber,
        newUser: userAdmin
    }).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'GraphQL request to the change the investigation county',
            step: `The investigation county changed successfully`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologyNumber,
        });
        response.send({message: 'The county has changed successfully'});
    }).catch((error) => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'GraphQL POST request to Db - change county',
            step: error,
            investigation: response.locals.epidemiologyNumber,
        });
        response.status(RESPONSE_ERROR_CODE).send('error while changing county');
    });
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
                })
                response.send(result.data.allSourceOrganizations.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Sources Organizations Query',
                    step: `couldnt query all sources organizations due to ${result?.errors[0]?.message}`,
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
                })
                response.send(result.data.allLanguages.nodes);
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'All Languages Query',
                    step: `couldnt query all languages due to ${result?.errors[0]?.message}`,
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
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all languages`);
        })
})

const convertUserToDB = (clientUserInput: any): User => {
    return {
        ...clientUserInput,
        investigationGroup: +clientUserInput.investigationGroup,
        fullName: clientUserInput.fullName.firstName + ' ' + clientUserInput.fullName.lastName,
        languages: clientUserInput.languages?.map((language: Language) => language.displayName)
    }
}

usersRoute.post('', (request: Request, response: Response) => {
    const newUser: User = convertUserToDB(request.body);
    graphqlRequest(CREATE_USER, response.locals, { input: newUser })
        .then((result: CreateUserResponse) => {
            if (result?.data?.createNewUser) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Create User',
                    step: `the user ${JSON.stringify(newUser)} was created successfully`,
                })
                response.send(result.data.createNewUser);
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.CRITICAL,
                    workflow: 'Create User',
                    step: `the user ${JSON.stringify(newUser)} wasn't created due to ${result?.errors[0]?.message}`,
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
            })
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to create investigator')
        });
});

usersRoute.post('/district', superAdminMiddleWare, (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching users by current user district',
        step: 'Querying the graphql API',
        user: response.locals.user.id
    });
    const { page } = request.body;
    graphqlRequest(
        GET_USERS_BY_DISTRICT_ID,
        response.locals,
        {
            offset: calculateOffset(page.number, page.size),
            size: page.size,
            orderBy: [request.body.orderBy ? request.body.orderBy : 'NATURAL'],
            filter: {
                countyByInvestigationGroup: {
                    districtByDistrictId: {
                        id: {
                            equalTo: response.locals.user.countyByInvestigationGroup.districtId
                        }
                    }
                },
                ...request.body.filter
            }
        }
    )
        .then((result: any) => {
            if (result?.data?.allUsers) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Fetching users by current user district',
                    step: 'Fetched users from the DB',
                    user: response.locals.user.id
                });
                const totalCount = result.data.allUsers.totalCount;
                const users = result.data.allUsers.nodes.map(toUser);
                response.send({ users, totalCount });
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Fetching users by current user district',
                    step: 'Didn\'t get data from the DB',
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get users')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'Fetching users by current user district',
                step: `Couldn\'t query users due to ${err}`,
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query users by current user district`);
        })
});

usersRoute.post('/county', adminMiddleWare, (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching users by current user\'s county id',
        step: 'Querying the graphql API',
        user: response.locals.user.id
    });
    const { page } = request.body;
    graphqlRequest(
        GET_USERS_BY_COUNTY_ID,
        response.locals,
        {
            offset: calculateOffset(page.number, page.size),
            size: page.size,
            orderBy: [request.body.orderBy ? request.body.orderBy : 'NATURAL'],
            filter: {
                countyByInvestigationGroup: {
                    id: {
                        equalTo: +response.locals.user.investigationGroup
                    }
                },
                ...request.body.filter
            }
        }
    )
        .then((result: any) => {
            if (result?.data?.allUsers) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Fetching users by current user\'s county id',
                    step: 'Fetched users from the DB',
                    user: response.locals.user.id
                });
                const totalCount = result.data.allUsers.totalCount;
                const users = result.data.allUsers.nodes.map(toUser);
                response.send({ users, totalCount });
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Fetching users by current user\'s county id',
                    step: 'Didn\'t get data from the DB',
                    user: response.locals.user.id
                })
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get users by county id')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.CRITICAL,
                workflow: 'Fetching users by current user\'s county id',
                step: `Couldn\'t query all users due to ${err}`,
            })
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all users`);
        })
});

const calculateOffset = (pageNumber: number, pageSize: number) => ((pageNumber - 1) * pageSize);

const toUser = (user: any) => ({
    id: user.id,
    fullName: user.fullName,
    userName: user.userName,
    phoneNumber: user.phoneNumber,
    mail: user.mail,
    identityNumber: user.identityNumber,
    city: user.cityByCity?.displayName,
    isActive: user.isActive,
    languages: user.userLanguagesByUserId.nodes.map((language: any) => language.language),
    userType: user.userTypeByUserType.displayName,
    desk: user.deskByDeskId?.deskName,
    investigationGroup: user.countyByInvestigationGroup?.displayName,
    sourceOrganization: user.sourceOrganizationBySourceOrganization?.displayName
});

export default usersRoute;
