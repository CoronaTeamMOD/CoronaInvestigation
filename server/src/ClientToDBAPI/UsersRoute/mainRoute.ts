import { Router, Request, Response } from 'express';

import User from '../../Models/User/User';
import { Service, Severity } from '../../Models/Logger/types';
import CreateUserResponse from '../../Models/User/CreateUserResponse';
import { graphqlRequest, errorStatusCode } from '../../GraphqlHTTPRequest';
import GetAllUserTypesResponse from '../../Models/User/GetAllUserTypesResponse';
import GetAllSourceOrganizations from '../../Models/User/GetAllSourceOrganizations';
import { adminMiddleWare, superAdminMiddleWare } from '../../middlewares/Authentication';
import GetAllLanguagesResponse, { Language } from '../../Models/User/GetAllLanguagesResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { UPDATE_IS_USER_ACTIVE, UPDATE_INVESTIGATOR, CREATE_USER, UPDATE_COUNTY_BY_USER, UPDATE_INVESTIGATOR_BY_GROUP_ID,
         UPDATE_SOURCE_ORGANIZATION, UPDATE_DESK } from '../../DBService/Users/Mutation';
import {
    GET_IS_USER_ACTIVE, GET_USER_BY_ID, GET_ACTIVE_GROUP_USERS,
    GET_ALL_LANGUAGES, GET_ALL_SOURCE_ORGANIZATION, GET_USERS_BY_DISTRICT_ID, GET_ALL_USER_TYPES, GET_USERS_BY_COUNTY_ID
} from '../../DBService/Users/Query';

const usersRoute = Router();
const unassignedUserPrefix = 'admin.group';

usersRoute.get('/userActivityStatus', (request: Request, response: Response) => {
    const userActivityStatusLogger = logger.setup({
        workflow: 'query user activity status by id',
        user: response.locals.user.id,
    });

    const parameters = { id: response.locals.user.id };
    userActivityStatusLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_IS_USER_ACTIVE, response.locals, parameters)
        .then(result => {
            userActivityStatusLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data?.userById);
        })
        .catch(error => {
            userActivityStatusLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
})

usersRoute.post('/updateSourceOrganizationById', adminMiddleWare, (request: Request, response: Response) => {
    const updateSourceOrganizationLogger = logger.setup({
        workflow: 'update user source organization',
        user: response.locals.user.id,
    });

    const updateSourceOrganizationVariables = {
        id : request.body.userId,
        sourceOrganization : request.body.sourceOrganization
    };
    updateSourceOrganizationLogger.info(launchingDBRequestLog(updateSourceOrganizationVariables), Severity.LOW);
    graphqlRequest(UPDATE_SOURCE_ORGANIZATION, response.locals, updateSourceOrganizationVariables)
        .then(result => {
            updateSourceOrganizationLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.updateUserById.user);
        })
        .catch(error => {
            updateSourceOrganizationLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
})

usersRoute.post('/updateDesk', adminMiddleWare, (request: Request, response: Response) => {
    const updateDeskLogger = logger.setup({
        workflow: 'update user desk',
        user: response.locals.user.id,
    });

    const updateDeskVariables = {
        id: request.body.userId,
        desk: request.body.desk
    };
    updateDeskLogger.info(launchingDBRequestLog(updateDeskVariables), Severity.LOW);
    graphqlRequest(UPDATE_DESK, response.locals, updateDeskVariables)
        .then(result => {
            updateDeskLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.updateUserById.user);
        })
        .catch(error => {
            updateDeskLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
})

const updateIsUserActive = (response: Response, id: string, isActive: Boolean) => {
    const updateIsActiveStatusVariables = {
        id,
        isActive
    };
    const updateIsUserActiveLogger = logger.setup({
        workflow: 'updating user activity status',
        user: response.locals.user.id,
    });
    updateIsUserActiveLogger.info(launchingDBRequestLog(updateIsActiveStatusVariables), Severity.LOW);

    graphqlRequest(UPDATE_IS_USER_ACTIVE, response.locals, updateIsActiveStatusVariables)
        .then(result => {
            updateIsUserActiveLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.updateUserById.user);
        })
        .catch(error => {
            updateIsUserActiveLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
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
        workflow: 'query user details by id',
        user: response.locals.user.id,
    });

    const parameters = { id: response.locals.user.id };
    userLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_USER_BY_ID, response.locals, parameters)
        .then(result => {
            userLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data);
        })
        .catch(error => {
            userLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
});

usersRoute.post('/changeInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    const epidemiologyNumbers: number[] = request.body.epidemiologyNumbers;
    const newUser: string = request.body.user;
    const transferReason: string = request.body.transferReason;
    const changeInvestigatorLogger = logger.setup({
        workflow: `change investigations' investigator`,
        user: response.locals.user.id,
    });

    const parameters = { epidemiologyNumbers, newUser, transferReason }
    changeInvestigatorLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    Promise.all(epidemiologyNumbers.map(epidemiologyNumber => graphqlRequest(UPDATE_INVESTIGATOR, response.locals,
        { epidemiologyNumber, newUser, transferReason })))
        .then(results => {
            changeInvestigatorLogger.info(validDBResponseLog, Severity.LOW);
            response.send(results[0]?.data);
        })
        .catch(error => {
            changeInvestigatorLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
});

usersRoute.post('/changeGroupInvestigator', adminMiddleWare, (request: Request, response: Response) => {
    const changeGroupInvestigatorLogger = logger.setup({
        workflow: 'change investigator for grouped investigatios',
        user: response.locals.user.id,
    });

    const parameters = { 
        newInvestigator: request.body.user,
        selectedGroups: request.body.groupIds,
        userCounty: response.locals.user.investigationGroup
    }
    changeGroupInvestigatorLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_INVESTIGATOR_BY_GROUP_ID, response.locals, parameters)
        .then(result => {
            changeGroupInvestigatorLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            changeGroupInvestigatorLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
});

usersRoute.post('/changeGroupCounty', adminMiddleWare, (request: Request, response: Response) => {
    const changeGroupCountyLogger = logger.setup({
        workflow: 'change county for grouped investigatios',
        user: response.locals.user.id,
    });
    
    const parameters = { 
        newInvestigator: `${unassignedUserPrefix}${request.body.county}`,
        selectedGroups: request.body.groupIds,
        userCounty: response.locals.user.investigationGroup,
        wasInvestigationTransferred: true
    }
    changeGroupCountyLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_INVESTIGATOR_BY_GROUP_ID, response.locals, parameters)
        .then(result => {
            changeGroupCountyLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            changeGroupCountyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
});

usersRoute.get('/userTypes', (request: Request, response: Response) => {
    const userTypesLogger = logger.setup({
        workflow: 'query all user types',
        user: response.locals.user.id,
    });
    userTypesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_USER_TYPES, response.locals)
        .then((result: GetAllUserTypesResponse) => {
            userTypesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allUserTypes?.nodes);
        })
        .catch(error => {
            userTypesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
})

usersRoute.get('/group', adminMiddleWare, (request: Request, response: Response) => {
    const groupLogger = logger.setup({
        workflow: `query investigators by county`,
        user: response.locals.user.id,
    });

    const parameters = { inputCountyId: +response.locals.user.investigationGroup };
    groupLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_ACTIVE_GROUP_USERS, response.locals, parameters)
        .then(result => {
            groupLogger.info(validDBResponseLog, Severity.LOW);
            const resData = result.data.getInvestigatorListByCountyFunction;
            console.log('resData',resData);
            const users: User[] = resData.map((user: any) => ({
                ...user,
                languages: user.languages.nodes.map((language: any) => language?.language),
                token: ''
            }));
            response.send(users);
        })
        .catch(error => {
            groupLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
});

usersRoute.post('/changeCounty', adminMiddleWare, (request: Request, response: Response) => {
    const changeCountyLogger = logger.setup({
        workflow: 'change the investigations county',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {
        epidemiologyNumbers: request.body.epidemiologyNumbers,
        newUser: `${unassignedUserPrefix}${request.body.updatedCounty}`,
        transferReason: request.body.transferReason || ''
    }
    changeCountyLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_COUNTY_BY_USER, response.locals, parameters)
    .then(result => {
        changeCountyLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data);
    }).catch(error => {
        changeCountyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    })
});

usersRoute.get('/sourcesOrganization', (request: Request, response: Response) => {
    const sourcesOrganizationLogger = logger.setup({
        workflow: 'query all sources organizations',
    });
    sourcesOrganizationLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_SOURCE_ORGANIZATION, response.locals)
        .then((result: GetAllSourceOrganizations) => {
            sourcesOrganizationLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allSourceOrganizations.nodes);
        })
        .catch((error) => {
            sourcesOrganizationLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
})

usersRoute.get('/languages', (request: Request, response: Response) => {
    const languagesLogger = logger.setup({
        workflow: 'query all languages',
    });
    languagesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_LANGUAGES, response.locals)
        .then((result: GetAllLanguagesResponse) => {
            languagesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allLanguages.nodes);
        })
        .catch((error) => {
            languagesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
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
        workflow: 'create user',
    });

    const parameters = {input: convertUserToDB(request.body)};
    createUserLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(CREATE_USER, response.locals, parameters)
        .then((result: CreateUserResponse) => {
            createUserLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.createNewUser);
        })
        .catch((error) => {
            createUserLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
});

usersRoute.post('/district', superAdminMiddleWare, (request: Request, response: Response) => {
    const districtLogger = logger.setup({
        workflow: 'query users by current user district',
        user: response.locals.user.id
    });

    const { page } = request.body;
    const parameters = {
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
    districtLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_USERS_BY_DISTRICT_ID,response.locals,parameters)
        .then(result => {
            districtLogger.info(validDBResponseLog, Severity.LOW);
            const totalCount = result.data.allUsers.totalCount;
            const users = result.data.allUsers.nodes.map(convertToUser);
            response.send({ users, totalCount });
        })
        .catch(error => {
            districtLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
});

usersRoute.post('/county', adminMiddleWare, (request: Request, response: Response) => {
    const countyLogger = logger.setup({
        workflow: 'query users by current user\'s county id',
        user: response.locals.user.id
    });
    const { page } = request.body;
    const parameters = {
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
    };
    countyLogger.info(launchingDBRequestLog(page), Severity.LOW);

    graphqlRequest(GET_USERS_BY_COUNTY_ID,response.locals,parameters)
        .then(result => {
            countyLogger.info(validDBResponseLog, Severity.LOW);
            const totalCount = result.data.allUsers.totalCount;
            const users = result.data.allUsers.nodes.map(convertToUser);
            response.send({ users, totalCount });
        })
        .catch(error => {
            countyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
});

const calculateOffset = (pageNumber: number, pageSize: number) => ((pageNumber - 1) * pageSize);

const convertToUser = (user: any) => ({
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
    desk: { id: user.deskByDeskId?.id, deskName: user.deskByDeskId?.deskName},
    investigationGroup: user.countyByInvestigationGroup?.displayName,
    sourceOrganization: user.sourceOrganizationBySourceOrganization?.displayName
});

export default usersRoute;
