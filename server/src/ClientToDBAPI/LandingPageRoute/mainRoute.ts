import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { CHANGE_DESK_ID } from '../../DBService/LandingPage/Mutation';
import GetAllInvestigationStatuses from '../../Models/InvestigationStatus/GetAllInvestigationStatuses';
import { graphqlRequest, multipleInvestigationsBulkErrorMessage, areAllResultsValid } from '../../GraphqlHTTPRequest';
import { GET_ALL_INVESTIGATION_STATUS, GROUP_INVESTIGATIONS, USER_INVESTIGATIONS } from '../../DBService/LandingPage/Query';

import { convertUserInvestigationsData, convertGroupInvestigationsData } from './utils';
import InvestigationStatus from '../../Models/InvestigationStatus/InvestigationMainStatus';

const errorStatusResponse = 500;

const landingPageRoute = Router();

const calculateOffset = (pageNumber: number, pageSize: number) => ((pageNumber - 1) * pageSize);

landingPageRoute.post('/investigations', (request: Request, response: Response) => {
    const { orderBy, size, currentPage, filterRules } = request.body;
    const filterBy = {
        creator: {
            equalTo: response.locals.user.id
        },
        ...filterRules
    };
    const getInvestigationsParameters = {
        filter: filterBy,
        orderBy,
        offset: calculateOffset(currentPage, size),
        size
    };
    const investigationsLogger = logger.setup({
        workflow: 'Getting Investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(USER_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {
            const orderedInvestigations = result?.data?.orderedInvestigations?.nodes;
            if (orderedInvestigations) {
                investigationsLogger.info('got investigations from the DB', Severity.LOW);
                response.send({allInvestigations: convertUserInvestigationsData(result.data)});
            }
            else {
                investigationsLogger.error(`got errors in querying the investigations from the DB ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(errorStatusResponse).send('error in fetching data')
            }
        })
        .catch(err => {
            investigationsLogger.error(`got errors in request to graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusResponse).send('error in fetching data: ' + err);
        });
})

landingPageRoute.post('/groupInvestigations', adminMiddleWare, (request: Request, response: Response) => {
    const { orderBy, size, currentPage, filterRules } = request.body;
    const filterBy = {
        userByCreator: {
            countyByInvestigationGroup: {
                id: {
                    equalTo: +response.locals.user.investigationGroup
                }
            }
        },
        ...filterRules
    };
    const getInvestigationsParameters = {
        filter: filterBy,
        orderBy,
        offset: calculateOffset(currentPage, size),
        size,
        unassignedFilter: filterBy
    };
    const groupInvestigationsLogger = logger.setup({
        workflow: 'Getting Investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GROUP_INVESTIGATIONS(+response.locals.user.investigationGroup), response.locals, getInvestigationsParameters)
        .then((result: any) => {
            if (result?.data?.orderedInvestigations?.nodes) {
                groupInvestigationsLogger.info('got results from the DB', Severity.LOW);
                response.send({
                    allInvestigations: convertGroupInvestigationsData(result.data), 
                    totalCount: +result.data.orderedInvestigations.totalCount,
                    unassignedInvestigationsCount: +result.data.unassignedInvestigations.totalCount
                });
            }
            else {
                groupInvestigationsLogger.error(`got error in querying the DB ${JSON.stringify(result)}`, Severity.HIGH);
                response.send(result)
            }
        })
        .catch(err => {
            groupInvestigationsLogger.error(`got error in requesting the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusResponse).send('error in fetching data: ' + err)
        });
})

landingPageRoute.get('/investigationStatuses', (request: Request, response: Response) => {
    const investigationStatusesLogger = logger.setup({
        workflow: 'Getting Investigations statuses',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigationStatusesLogger.info('launching graphql API investigationStatuses request', Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATION_STATUS, response.locals)
        .then((result: GetAllInvestigationStatuses) => {
            if (result?.data?.allInvestigationStatuses) {
                investigationStatusesLogger.info('got results from the DB', Severity.LOW);
                const convertedStatuses: InvestigationStatus[] = result.data.allInvestigationStatuses.nodes;
                response.send(convertedStatuses);
            }
            else {
                investigationStatusesLogger.error(`got error in querying the DB ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(errorStatusResponse).send('error in fetching data')
            }
        })
        .catch(err => {
            investigationStatusesLogger.error(`got error in requesting the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusResponse).send('error in fetching data: ' + err)
        });
})

landingPageRoute.post('/changeDesk', adminMiddleWare, (request: Request, response: Response) => {
    const epidemiologyNumbers: number[] = request.body.epidemiologyNumbers;
    const updatedDesk: number = request.body.updatedDesk;
    const transferReason: number = request.body.transferReason;
    const changeDeskLogger = logger.setup({
        workflow: 'Change desk id',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    changeDeskLogger.info('launching graphql API desks request', Severity.LOW);
    Promise.all(epidemiologyNumbers.map(epidemiologyNumber => graphqlRequest(CHANGE_DESK_ID, response.locals, {epidemiologyNumber, updatedDesk, transferReason})))
    .then((results: any[]) => {
        if (areAllResultsValid(results)) {
            changeDeskLogger.info(`desk id has been changed in the DB, investigations: ${epidemiologyNumbers}`, Severity.LOW);
            response.send(results[0]?.data || '');
        } else {
            changeDeskLogger.error(`desk id hasnt been changed in the DB in investigations ${epidemiologyNumbers}, due to: ${multipleInvestigationsBulkErrorMessage(results, epidemiologyNumbers)}`, Severity.HIGH);
            response.sendStatus(errorStatusResponse);
        }
    }).catch(err => {
            changeDeskLogger.error(`querying the graphql API failed du to ${err}`, Severity.HIGH);
            response.sendStatus(errorStatusResponse);
        });
})

export default landingPageRoute;