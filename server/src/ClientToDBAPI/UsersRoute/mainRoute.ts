import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import User from '../../Models/User/User';
import { Service, Severity } from '../../Models/Logger/types';
import CreateUserResponse from '../../Models/User/CreateUserResponse';
import GetAllUserTypesResponse from '../../Models/User/GetAllUserTypesResponse';
import GetAllSourceOrganizations from '../../Models/User/GetAllSourceOrganizations';
import { adminMiddleWare, superAdminMiddleWare } from '../../middlewares/Authentication';
import GetAllLanguagesResponse, { Language } from '../../Models/User/GetAllLanguagesResponse';
import { graphqlRequest, multipleInvestigationsBulkErrorMessage, areAllResultsValid } from '../../GraphqlHTTPRequest';
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR, CREATE_USER, UPDATE_COUNTY_BY_USER, UPDATE_INVESTIGATOR_BY_GROUP_ID, UPDATE_SOURCE_ORGANIZATION, DELETE_SOURCE_ORGANIZATION } from '../../DBService/Users/Mutation';
import {
    GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ACTIVE_GROUP_USERS,
    GET_ALL_LANGUAGES, GET_ALL_SOURCE_ORGANIZATION, GET_USERS_BY_DISTRICT_ID, GET_ALL_USER_TYPES, GET_USERS_BY_COUNTY_ID
} from '../../DBService/Users/Query';

const usersRoute = Router();
const RESPONSE_ERROR_CODE = 500;
const badRequestStatusCode = 400;

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    const userActivityStatusLogger = logger.setup({
        workflow: 'Getting user activity status',
        user: response.locals.user.id,
    });
    userActivityStatusLogger.info(`make the graphql API request with parameters ${JSON.stringify({ id: response.locals.user.id })}`, Severity.LOW);
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data) {
                userActivityStatusLogger.info('got response from the DB', Severity.LOW);
                response.send(result.data?.userById);
            }
            else {
                userActivityStatusLogger.error('didnt get data from the DB', Severity.HIGH);
                response.status(badRequestStatusCode).send(`Couldn't find the user nor get its status`);
            }
        })
        .catch(error => {
            userActivityStatusLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to fetch isActive user status');
        })
})

usersRoute.post('/updateSourceOrganizationById', adminMiddleWare, (request: Request, response: Response) => {
    const updateSourceOrganizationVariables = {
        id : request.body.userId,
        sourceOrganization : request.body.sourceOrganization
    };
    const updateSourceOrganizationLogger = logger.setup({
        workflow: 'Updating user source organization',
        user: response.locals.user.id,
    });
    updateSourceOrganizationLogger.info(`make the graphql API request with parameters ${JSON.stringify(updateSourceOrganizationVariables)}`, Severity.LOW);
    graphqlRequest(UPDATE_SOURCE_ORGANIZATION, response.locals, updateSourceOrganizationVariables)
        .then((result: any) => {
            if (result.data.updateUserById) {
                updateSourceOrganizationLogger.info('got response from the DB', Severity.LOW);
                response.send(result.data.updateUserById.user);
            }
            else {
                updateSourceOrganizationLogger.error('didnt get data from the DB', Severity.HIGH);
                response.status(badRequestStatusCode).send(`Couldn't find the user nor update source organization`);
            }
        })
        .catch(error => {
            updateSourceOrganizationLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to change user source organization')
        })
})

usersRoute.post('/deleteSourceOrganizationById', adminMiddleWare, (request: Request, response: Response) => {
    const id = request.body.userId;
    const deleteSourceOrganizationLogger = logger.setup({
        workflow: 'Deleting user source organization',
        user: response.locals.user.id,
    });
    deleteSourceOrganizationLogger.info(`make the graphql API request with parameter ${id}`, Severity.LOW);
    graphqlRequest(DELETE_SOURCE_ORGANIZATION, response.locals, {id})
        .then((result: any) => {
            if (result.data.updateUserById) {
                deleteSourceOrganizationLogger.info('got response from the DB', Severity.LOW);
                response.send(result.data.updateUserById.user);
            }
            else {
                deleteSourceOrganizationLogger.error('didnt get data from the DB', Severity.HIGH);
                response.status(badRequestStatusCode).send(`Couldn't find the user nor delete source organization`);
            }
        })
        .catch(error => {
            deleteSourceOrganizationLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to delete user source organization')
        })
})

const updateIsUserActive = (response: Response, id: string, isActive: Boolean) => {
    const updateIsActiveStatusVariables = {
        id,
        isActive
    };
    const updateIsUserActiveLogger = logger.setup({
        workflow: 'Updating user activity status',
        user: response.locals.user.id,
    });
    updateIsUserActiveLogger.info(`make the graphql API request with parameters ${JSON.stringify(updateIsActiveStatusVariables)}`, Severity.LOW);
    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, updateIsActiveStatusVariables)
        .then((result: any) => {
            if (result.data.updateUserById) {
                updateIsUserActiveLogger.info('got response from the DB', Severity.LOW);
                response.send(result.data.updateUserById.user);
            }
            else {
                updateIsUserActiveLogger.error('didnt get data from the DB', Severity.HIGH);
                response.status(badRequestStatusCode).send(`Couldn't find the user nor update the status`);
            }
        })
        .catch(error => {
            updateIsUserActiveLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to activate / deactivate user')
        })
}

usersRoute.post('/updateIsUserActive', (request: Request, response: Response) => {
    updateIsUserActive(response, response.locals.user.id, request.body.isActive);
})

usersRoute.post('/updateIsUserActiveById', adminMiddleWare, (request: Request, response: Response) => {
    updateIsUserActive(response, request.body.userId, request.body.isActive);
})

usersRoute.get('/user', (request: Request, response: Response) => {
    const userLogger = logger.setup({
        workflow: 'Getting user details',
        user: response.locals.user.id,
    });
    userLogger.info('requesting graphql API for user details', Severity.LOW);
    graphqlRequest(GET_USER_BY_ID, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            userLogger.info('got the result from the DB', Severity.LOW);
            response.send(result.data);
        })
        .catch(err => {
            userLogger.error(`failed to get user details from the DB due to: ${err}`, Severity.HIGH);
        });
});

usersRoute.post('/changeInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    const epidemiologyNumbers: number[] = request.body.epidemiologyNumbers;
    const newUser: string = request.body.user;
    const transferReason: string = request.body.transferReason;
    const changeInvestigatorLogger = logger.setup({
        workflow: 'Switch investigator',
        user: response.locals.user.id,
    });
    changeInvestigatorLogger.info(`querying the graphql API with parameters ${JSON.stringify(request.body)}`, Severity.LOW);
    Promise.all(epidemiologyNumbers.map(epidemiologyNumber => graphqlRequest(UPDATE_INVESTIGATOR, response.locals,
        { epidemiologyNumber, newUser, transferReason })))
        .then((results: any[]) => {
            if (areAllResultsValid(results)) {
                changeInvestigatorLogger.info(`investigator have been changed in the DB, investigations: ${epidemiologyNumbers}`, Severity.LOW);
                response.send(results[0]?.data);
            } else {
                changeInvestigatorLogger.error(`desk id hasnt been changed in the DB in investigations ${epidemiologyNumbers}, due to: ${multipleInvestigationsBulkErrorMessage(results, epidemiologyNumbers)}`, Severity.HIGH);
                response.sendStatus(RESPONSE_ERROR_CODE);
            }
        });
});

usersRoute.post('/changeGroupInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    const changeGroupInvestigatorLogger = logger.setup({
        workflow: 'change investigator for grouped investigatios',
        user: response.locals.user.id,
    });
    const newInvestigator = request.body.user;
    const selectedGroups = request.body.groupIds;
    const userCounty = response.locals.user.investigationGroup;
    const reason = request.body.reason ? request.body.reason : '';
    changeGroupInvestigatorLogger.info(`querying the graphql API with parameters ${JSON.stringify(request.body)}`, Severity.LOW);
    graphqlRequest(UPDATE_INVESTIGATOR_BY_GROUP_ID, response.locals, { newInvestigator, selectedGroups, userCounty, reason })
        .then((result: any) => {
            if (result?.data && !result.errors) {
                changeGroupInvestigatorLogger.info(`investigator have been changed in the DB for group: ${selectedGroups}`, Severity.LOW);
                response.send(result);
            } else {
                changeGroupInvestigatorLogger.error(`failed to change investigator for group ${selectedGroups} due to: ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).json({ message: `failed to change investigator for group ${selectedGroups}` });
            }
        })
        .catch(error => {
            changeGroupInvestigatorLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send(`Error while trying to change investigator to group: ${selectedGroups}`);
        });
});

usersRoute.post('/changeGroupCounty', adminMiddleWare, (request: Request, response: Response) => {
    const changeGroupCountyLogger = logger.setup({
        workflow: 'change county for grouped investigatios',
        user: response.locals.user.id,
    });
    let newInvestigator = 'admin.group' + request.body.county;
    const selectedGroups = request.body.groupIds;
    const userCounty = response.locals.user.investigationGroup;
    changeGroupCountyLogger.info(`querying the graphql API with parameters ${JSON.stringify(request.body)}`, Severity.LOW);
    graphqlRequest(UPDATE_INVESTIGATOR_BY_GROUP_ID, response.locals, { newInvestigator, selectedGroups, userCounty, wasInvestigationTransferred: true })
        .then((result: any) => {
            if (result?.data && !result.errors) {
                changeGroupCountyLogger.info(`investigator have been changed in the DB for group: ${selectedGroups}`, Severity.LOW);
                response.send(result);
            } else {
                changeGroupCountyLogger.error(`failed to change investigator for group ${selectedGroups} due to: ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).json({ message: `failed to change investigator for group ${selectedGroups}` });
            }
        })
        .catch(error => {
            changeGroupCountyLogger.error(`failed to get response from the graphql API due to: ${error}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send(`Error while trying to change investigator to group: ${selectedGroups}`);
        });
});

usersRoute.get('/userTypes', (request: Request, response: Response) => {
    const userTypesLogger = logger.setup({
        workflow: 'Getting user types',
        user: response.locals.user.id,
    });
    userTypesLogger.info('querying the graphql API', Severity.LOW);
    graphqlRequest(GET_ALL_USER_TYPES, response.locals)
        .then((result: GetAllUserTypesResponse) => {
            if (result?.data?.allUserTypes) {
                userTypesLogger.info('got user types from the DB', Severity.LOW);
                response.send(result.data.allUserTypes?.nodes)
            } else {
                userTypesLogger.error('didnt get data from the DB', Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get userTypes')
            }
        })
        .catch(err => {
            userTypesLogger.error(`couldnt query all user types due to ${err}`, Severity.CRITICAL);
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all userTypes`);
        })
})

usersRoute.get('/group', adminMiddleWare, (request: Request, response: Response) => {
    const groupLogger = logger.setup({
        workflow: `fetch investigators by county ${response.locals.user.investigationGroup}`,
        user: response.locals.user.id,
    });
    groupLogger.info('requesting the graphql API', Severity.LOW);
    graphqlRequest(GET_ACTIVE_GROUP_USERS, response.locals, { investigationGroup: +response.locals.user.investigationGroup })
        .then((result: any) => {
            if (result.data && !result.errors) {
                let users: User[] = [];
                groupLogger.info('got group users from the DB', Severity.LOW);
                users = result.data.allUsers.nodes.map((user: any) => ({
                    ...user,
                    languages: user.languages.nodes.map((language: any) => language?.language),
                    token: ''
                }));
                response.send(users);
            } else {
                groupLogger.error(`didnt get group users from the DB due to ${result.errors[0]?.message}`, Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).send(result.errors[0]?.message);
            }
        })
        .catch(err => {
            groupLogger.error(`couldnt query investigators due to ${err}`, Severity.CRITICAL);
            response.status(RESPONSE_ERROR_CODE).send(`couldn't query investigators`);
        })
});

usersRoute.post('/changeCounty', adminMiddleWare, (request: Request, response: Response) => {
    const epidemiologyNumbers: number[] = request.body.epidemiologyNumbers;
    let userAdmin = 'admin.group' + request.body.updatedCounty;
    const transferReason: string = request.body.transferReason || '';
    const changeCountyLogger = logger.setup({
        workflow: 'GraphQL request to the change the investigation county',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    changeCountyLogger.info('launching graphql API counties request', Severity.LOW);
    graphqlRequest(UPDATE_COUNTY_BY_USER, response.locals, {
        epidemiologyNumbers,
        newUser: userAdmin,
        transferReason
    }).then((result: any) => {
        if (result?.data && !result.errors) {
            changeCountyLogger.info(`The investigation county changed successfully, investigations: ${epidemiologyNumbers}`, Severity.LOW);
            response.send(result?.data || '');
        } else {
            changeCountyLogger.error(`County hasnt been changed in the DB in investigations ${epidemiologyNumbers}, due to: ${multipleInvestigationsBulkErrorMessage(result, epidemiologyNumbers)}`, Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('error while changing county');
        }
    }).catch(err => {
        changeCountyLogger.error(`querying the graphql API failed du to ${err}`, Severity.HIGH);
        response.status(RESPONSE_ERROR_CODE).send('error while changing county');
    })
});

usersRoute.get('/sourcesOrganization', (request: Request, response: Response) => {
    const sourcesOrganizationLogger = logger.setup({
        workflow: 'All Sources Organizations Query',
    });
    graphqlRequest(GET_ALL_SOURCE_ORGANIZATION, response.locals)
        .then((result: GetAllSourceOrganizations) => {
            if (result?.data?.allSourceOrganizations?.nodes) {
                sourcesOrganizationLogger.info('Queried all sources organizations successfully', Severity.LOW);
                response.send(result.data.allSourceOrganizations.nodes);
            } else {
                sourcesOrganizationLogger.error(`couldnt query all sources organizations due to ${result?.errors[0]?.message}`, Severity.CRITICAL);
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all sources organizations`);
            }
        })
        .catch((error) => {
            sourcesOrganizationLogger.error(`couldnt query all sources organizations due to ${error}`, Severity.CRITICAL);
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all sources organizations`);
        })
})

usersRoute.get('/languages', (request: Request, response: Response) => {
    const languagesLogger = logger.setup({
        workflow: 'All Languages Query',
    });
    graphqlRequest(GET_ALL_LANGUAGES, response.locals)
        .then((result: GetAllLanguagesResponse) => {
            if (result?.data?.allLanguages?.nodes) {
                languagesLogger.info('Queried all languages successfully', Severity.LOW);
                response.send(result.data.allLanguages.nodes);
            } else {
                languagesLogger.error(`couldnt query all languages due to ${result?.errors[0]?.message}`, Severity.CRITICAL);
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't query all languages`);
            }
        })
        .catch((error) => {
            languagesLogger.error(`couldnt query all languages due to ${error}`, Severity.CRITICAL);
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
    const createUserLogger = logger.setup({
        workflow: 'Create User',
    });
    const newUser: User = convertUserToDB(request.body);
    graphqlRequest(CREATE_USER, response.locals, { input: newUser })
        .then((result: CreateUserResponse) => {
            if (result?.data?.createNewUser) {
                createUserLogger.info(`the user ${JSON.stringify(newUser)} was created successfully`, Severity.LOW);
                response.send(result.data.createNewUser);
            }
            else {
                createUserLogger.error(`the user ${JSON.stringify(newUser)} wasn't created due to ${result?.errors[0]?.message}`, Severity.CRITICAL);
                response.status(RESPONSE_ERROR_CODE).send(`Couldn't create investigator`)
            };
        })
        .catch((error) => {
            createUserLogger.error(`the user ${JSON.stringify(newUser)} wasn't created due to ${error}`, Severity.CRITICAL);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to create investigator')
        });
});

usersRoute.post('/district', superAdminMiddleWare, (request: Request, response: Response) => {
    const districtLogger = logger.setup({
        workflow: 'Fetching users by current user district',
        user: response.locals.user.id
    });
    districtLogger.info('Querying the graphql API', Severity.LOW);
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
                districtLogger.info('Fetched users from the DB', Severity.LOW);
                const totalCount = result.data.allUsers.totalCount;
                const users = result.data.allUsers.nodes.map(toUser);
                response.send({ users, totalCount });
            } else {
                districtLogger.error('Didn\'t get data from the DB', Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get users')
            }
        })
        .catch(err => {
            districtLogger.error(`Couldn\'t query users due to ${err}`, Severity.CRITICAL);
            response.status(RESPONSE_ERROR_CODE).send(`Couldn't query users by current user district`);
        })
});

usersRoute.post('/county', adminMiddleWare, (request: Request, response: Response) => {
    const countyLogger = logger.setup({
        workflow: 'Fetching users by current user\'s county id',
        user: response.locals.user.id
    });
    countyLogger.info('Querying the graphql API', Severity.LOW);
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
                countyLogger.info('Fetched users from the DB', Severity.LOW);
                const totalCount = result.data.allUsers.totalCount;
                const users = result.data.allUsers.nodes.map(toUser);
                response.send({ users, totalCount });
            } else {
                countyLogger.error('Didn\'t get data from the DB', Severity.HIGH);
                response.status(RESPONSE_ERROR_CODE).send('Error while trying to get users by county id')
            }
        })
        .catch(err => {
            countyLogger.error(`Couldn\'t query all users due to ${err}`, Severity.CRITICAL);
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
