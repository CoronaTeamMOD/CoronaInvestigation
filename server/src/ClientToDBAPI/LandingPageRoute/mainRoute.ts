import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { graphqlRequest, errorStatusCode } from '../../GraphqlHTTPRequest';
import { convertUserInvestigationsData, convertGroupInvestigationsData } from './utils';
import { CHANGE_DESK_ID, UPDATE_DESK_BY_GROUP_ID } from '../../DBService/LandingPage/Mutation';
import GetAllInvestigationStatuses from '../../Models/InvestigationStatus/GetAllInvestigationStatuses';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { GET_ALL_INVESTIGATION_STATUS, GROUP_INVESTIGATIONS, USER_INVESTIGATIONS, GET_INVESTIGATION_STATISTICS, GET_ALL_INVESTIGATION_SUB_STATUS } from '../../DBService/LandingPage/Query';

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
                totalCount: +result.data.orderedInvestigations.totalCount
            });
        })
        .catch(error => {
            investigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

landingPageRoute.post('/groupInvestigations', adminMiddleWare, (request: Request, response: Response) => {
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
        filter: filterBy,
        orderBy,
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
        transferReason: request.body.transferReason
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

landingPageRoute.post('/changeGroupDesk', adminMiddleWare, (request: Request, response: Response) => {
    const changeGroupDeskLogger = logger.setup({
        workflow: 'change desk for grouped investigatios',
        user: response.locals.user.id,
    });

    const parameters = { 
        desk: request.body.desk,
        selectedGroups: request.body.groupIds,
        userCounty: request.body.county, 
        reason:  request.body.reason || ''
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

landingPageRoute.post('/investigationStatistics', adminMiddleWare ,(request: Request, response: Response) => {
    const investigationsStatisticsLogger = logger.setup({
        workflow: 'query investigations statistics',
        user: response.locals.user.id,
    });

    const desks = request.body.deskFilter;
    const timeRange = request.body.timeRangeFilter; 
    const county = request.body.county; 
    const dateFilter = new Date(Date.now() - (4 * 60 * 60 * 1000)).toUTCString();

    const desksFilter = desks
                        ? { deskId : { in : desks}} 
                        : {};

    const timeRangeFilter = timeRange
                        ? { creationDate: { greaterThanOrEqualTo: timeRange.startDate, lessThanOrEqualTo: timeRange.endDate }} 
                        : {};
    
    const lastUpdateDateFilter = {
        lastUpdateTime: {
            lessThan: dateFilter
        }
    };
    
    const userFilters = {
        userByCreator: {
            countyByInvestigationGroup: {
                id: {equalTo: county}
            }
        },
        ...desksFilter,
        ...timeRangeFilter
    };

    const parameters = { userFilters, allInvesitgationsFilter: userFilters };
    investigationsStatisticsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATION_STATISTICS, response.locals, { userFilters, 
                                                                    allInvesitgationsFilter: userFilters, 
                                                                    lastUpdateDateFilter: lastUpdateDateFilter})
    .then((results) => {
        const {data: preprocessedResults} = results;
        const outcome: any = {};
        Object.keys(preprocessedResults).forEach(preprocessedResult => {
            outcome[preprocessedResult] = preprocessedResults[preprocessedResult].totalCount;
        })
        response.send(outcome); 
    })
    .catch(error => {
        investigationsStatisticsLogger.error(invalidDBResponseLog(error), Severity.HIGH)
        response.status(errorStatusCode).send(error);
    })
})

export default landingPageRoute;