import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import handleCountyRequest from '../../middlewares/HandleCountyRequest';
import { convertUserInvestigationsData, convertGroupInvestigationsData } from './utils';
import { graphqlRequest, errorStatusCode, validStatusCode } from '../../GraphqlHTTPRequest';
import { CHANGE_DESK_ID, UPDATE_DESK_BY_GROUP_ID, CREATE_ADMIN_MESSAGE, DELETE_ADMIN_MESSAGE } from '../../DBService/LandingPage/Mutation';
import GetAllInvestigationStatuses from '../../Models/InvestigationStatus/GetAllInvestigationStatuses';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import {
    GET_ALL_INVESTIGATION_STATUS,
    GROUP_INVESTIGATIONS,
    USER_INVESTIGATIONS,
    GET_INVESTIGATION_STATISTICS,
    GET_ALL_INVESTIGATION_SUB_STATUS,
    GET_ALL_ADMIN_INVESTIGATIONS,
    GET_ALL_ADMIN_MESSAGES_BY_DESK,
    GET_ALL_ADMIN_MESSAGES_BY_DESK_AND_ADMIN,
    GET_ALL_INVESTIGATOR_REFERENCE_STATUSES,
    GET_ALL_CHAT_STATUSES,
    GET_ALL_VACCINE_DOSES,
    GET_RULES_CONFIG_BY_KEY,
    GET_ALL_TRANSFER_REASON
} from '../../DBService/LandingPage/Query';

const landingPageRoute = Router();

const calculateOffset = (pageNumber: number, pageSize: number) => ((pageNumber - 1) * pageSize);

landingPageRoute.post('/investigations', (request: Request, response: Response) => {
    const investigationsLogger = logger.setup({
        workflow: `query investigator's Investigations`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    
    const { orderBy, size, currentPage, filterRules } = request.body;
    const filterBy = {
        ...filterRules,
        userByCreator: {
            ...filterRules.userByCreator,
            id: {
                equalTo: response.locals.user.id
            }
        },
    };

    const getInvestigationsParameters = {
        userId:response.locals.user.id,
        filter: filterBy,
        orderBy,
        offset: calculateOffset(currentPage, size),
        size
    };
    investigationsLogger.info(launchingDBRequestLog(getInvestigationsParameters), Severity.LOW);

    graphqlRequest(USER_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then(result => {
            investigationsLogger.info(validDBResponseLog, Severity.LOW);
            response.send({
                allInvestigations: convertUserInvestigationsData(result.data),
                totalCount: +result.data.orderedUserInvestigations.totalCount
            });
        })
        .catch(error => {
            investigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/groupInvestigations', handleCountyRequest, (request: Request, response: Response) => {
    const groupInvestigationsLogger = logger.setup({
        workflow: `query group's Investigations`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })

    const { orderBy, size, currentPage, filterRules, county } = request.body;
    const filterBy = {
        ...filterRules,
        userByCreator: {
            ...filterRules.userByCreator,
            countyByInvestigationGroup: {
                id: {
                    equalTo: +county
                }
            }
        },
    };
    const getInvestigationsParameters = {
        county:+county,
        filter: filterBy,
        orderBy: orderBy,
        offset: calculateOffset(currentPage, size),
        size,
        unassignedFilter: filterBy
    };
    groupInvestigationsLogger.info(launchingDBRequestLog(getInvestigationsParameters), Severity.LOW);

    graphqlRequest(GROUP_INVESTIGATIONS(+county), response.locals, getInvestigationsParameters)
        .then(result => {
            groupInvestigationsLogger.info(validDBResponseLog, Severity.LOW);
            response.send({
                allInvestigations: convertGroupInvestigationsData(result.data),
                totalCount: +result.data.orderedInvestigations.totalCount,
                unassignedInvestigationsCount: +result.data.unassignedInvestigations.totalCount
            });
        })
        .catch(error => {
            groupInvestigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/investigationStatuses', (request: Request, response: Response) => {
    const investigationStatusesLogger = logger.setup({
        workflow: 'query all investigation statuses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigationStatusesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATION_STATUS, response.locals)
        .then((result: GetAllInvestigationStatuses) => {
            investigationStatusesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allInvestigationStatuses.nodes);
        })
        .catch(error => {
            investigationStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/adminInvestigations', (request: Request, response: Response) => {
    const adminInvestigationsLogger = logger.setup({
        workflow: 'query all admin investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const desks = request.body.desks;
    const orderBy = request.body.orderBy;
    const county = request.body.county;
    const timeRange = request.body.timeRangeFilter;

    const parameters = {
        county,
        desks,
        orderBy,
        startDate: timeRange?.startDate,
        endDate: timeRange?.endDate
    }

    adminInvestigationsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_ADMIN_INVESTIGATIONS, response.locals, parameters)
        .then((result: any) => {
            adminInvestigationsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.adminInvestigations.json);
        })
        .catch(error => {
            adminInvestigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/investigationSubStatuses', (request: Request, response: Response) => {
    const investigationSubStatusesLogger = logger.setup({
        workflow: 'query all investigation sub statuses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigationSubStatusesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATION_SUB_STATUS, response.locals)
        .then((result: any) => {
            investigationSubStatusesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allInvestigationSubStatuses.nodes);
        })
        .catch(error => {
            investigationSubStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/changeDesk', adminMiddleWare, (request: Request, response: Response) => {
    const changeDeskLogger = logger.setup({
        workflow: 'change investigation desk',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {
        epidemiologyNumbers: request.body.epidemiologyNumbers,
        updatedDesk: request.body.updatedDesk,
        transferReason: request.body.otherTransferReason,
        transferReasonId: request.body.transferReason.id
    };
    changeDeskLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(CHANGE_DESK_ID, response.locals, parameters)
        .then((result: any) => {
            changeDeskLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data);
        }).catch(error => {
            changeDeskLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/changeGroupDesk', handleCountyRequest, (request: Request, response: Response) => {
    const changeGroupDeskLogger = logger.setup({
        workflow: 'change desk for grouped investigatios',
        user: response.locals.user.id,
    });

    const parameters = {
        desk: request.body.desk,
        selectedGroups: request.body.groupIds,
        userCounty: request.body.county,
        reason: request.body.reason || '',
        transferReasonId: request.body.reasonId?.id
    }
    changeGroupDeskLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_DESK_BY_GROUP_ID, response.locals, parameters)
        .then(result => {
            changeGroupDeskLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            changeGroupDeskLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

landingPageRoute.post('/investigationStatistics', handleCountyRequest, (request: Request, response: Response) => {
    const investigationsStatisticsLogger = logger.setup({
        workflow: 'query investigations statistics',
        user: response.locals.user.id,
    });

    const desks = request.body.deskFilter;
    const timeRange = request.body.timeRangeFilter;
    const county = request.body.county;

    const parameters = {
        county,
        desks,
        startDate: timeRange?.startDate,
        endDate: timeRange?.endDate
    }
    investigationsStatisticsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATION_STATISTICS, response.locals, parameters)
        .then((results) => {
            response.send(results.data.functionGetInvestigationStatistics.json);
        })
        .catch(error => {
            investigationsStatisticsLogger.error(invalidDBResponseLog(error), Severity.HIGH)
            response.status(errorStatusCode).send(error);
        })
})

landingPageRoute.get('/adminMessages/:desksId', (request: Request, response: Response) => {
    const adminMessagesLogger = logger.setup({
        workflow: 'query get all admin messages filter by desks id',
        user: response.locals.user.id,
    });

    adminMessagesLogger.info(launchingDBRequestLog(), Severity.LOW);
    const parameters = {
        desksIdInput: request.params.desksId.split(',').map(deskId => parseInt(deskId))
    }
    graphqlRequest(GET_ALL_ADMIN_MESSAGES_BY_DESK, response.locals, parameters)
        .then((result: any) => {
            adminMessagesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allAdminMessages.nodes);
        })
        .catch(error => {
            adminMessagesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/adminMessages/:desksId/:adminId', adminMiddleWare, (request: Request, response: Response) => {
    const adminMessagesLogger = logger.setup({
        workflow: 'query get all admin messages filter by desks id',
        user: response.locals.user.id,
    });

    adminMessagesLogger.info(launchingDBRequestLog(), Severity.LOW);
    const parameters = {
        desksIdInput: request.params.desksId.split(',').map(deskId => parseInt(deskId)),
        adminIdInput: request.params.adminId
    }

    graphqlRequest(GET_ALL_ADMIN_MESSAGES_BY_DESK_AND_ADMIN, response.locals, parameters)
        .then((result: any) => {
            adminMessagesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allAdminMessages.nodes);
        })
        .catch(error => {
            adminMessagesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/sendMessage', adminMiddleWare, (request: Request, response: Response) => {
    const adminMessagesLogger = logger.setup({
        workflow: 'send new message',
        user: response.locals.user.id,
    });

    adminMessagesLogger.info(launchingDBRequestLog(), Severity.LOW);
    const parameters = { ...request.body };
    graphqlRequest(CREATE_ADMIN_MESSAGE, response.locals, parameters)
        .then((result: any) => {
            response.sendStatus(validStatusCode)
            adminMessagesLogger.info(validDBResponseLog, Severity.LOW);
        })
        .catch(error => {
            adminMessagesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/deleteMessage', adminMiddleWare, (request: Request, response: Response) => {
    const adminMessagesLogger = logger.setup({
        workflow: 'send new message',
        user: response.locals.user.id,
    });

    adminMessagesLogger.info(launchingDBRequestLog(), Severity.LOW);
    const parameters = { id: request.body };
    graphqlRequest(DELETE_ADMIN_MESSAGE, response.locals, parameters)
        .then((result: any) => {
            adminMessagesLogger.info(validDBResponseLog, Severity.LOW);
            response.sendStatus(validStatusCode)
        })
        .catch(error => {
            adminMessagesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/investigatorReferenceStatuses', (request: Request, response: Response) => {
    const investigatiorReferebceStatusesLogger = logger.setup({
        workflow: 'query all investor reference statuses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigatiorReferebceStatusesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATOR_REFERENCE_STATUSES, response.locals)
        .then((result: any) => {
            investigatiorReferebceStatusesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allInvestigatorReferenceStatuses.nodes);
        })
        .catch(error => {
            investigatiorReferebceStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/chatStatuses', (request: Request, response: Response) => {
    const chatStatusesLogger = logger.setup({
        workflow: 'query all chat statuses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    chatStatusesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_CHAT_STATUSES, response.locals)
        .then((result: any) => {
            chatStatusesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allChatStatuses.nodes);
        })
        .catch(error => {
            chatStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/vaccineDoses', (request: Request, response: Response) => {
    const vaccineDosesLogger = logger.setup({
        workflow: 'query all vaccine doses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    vaccineDosesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_VACCINE_DOSES, response.locals)
        .then((result: any) => {
            vaccineDosesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allVaccineDoses.nodes);
        })
        .catch(error => {
            vaccineDosesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/getRulesConfigByKey/:key', (request: Request, response: Response) => { 
    const key: string = request.params.key || '';
    const rulesConfigLogger = logger.setup({
        workflow: 'query rules config by key',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    const parameters ={key};
    rulesConfigLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_RULES_CONFIG_BY_KEY, response.locals, parameters)
        .then((result: any) => {
            rulesConfigLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.rulesConfigByKey);
        })
        .catch(error => {
            rulesConfigLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.get('/transferReasons', (request: Request, response: Response) => {
    const transferReasonsLogger = logger.setup({
        workflow: 'query all transfer reasons',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    transferReasonsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_TRANSFER_REASON, response.locals)
        .then((result: any) => {
            transferReasonsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allTrasferReasons.nodes);
        })
        .catch(error => {
            transferReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

export default landingPageRoute;