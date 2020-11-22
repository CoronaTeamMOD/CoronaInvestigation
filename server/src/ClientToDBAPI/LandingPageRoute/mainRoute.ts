import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { CHANGE_DESK_ID } from '../../DBService/LandingPage/Mutation';
import GetAllInvestigationStatuses from '../../Models/InvestigationStatus/GetAllInvestigationStatuses';
import { graphqlRequest, multipleInvestigationsBulkErrorMessage, areAllResultsValid } from '../../GraphqlHTTPRequest';
import { GET_USER_INVESTIGATIONS, GET_GROUP_INVESTIGATIONS, GET_ALL_INVESTIGATION_STATUS, ORDERED_INVESTIGATIONS } from '../../DBService/LandingPage/Query';

import { convertOrderedInvestigationsData } from './utils';

const errorStatusResponse = 500;

const landingPageRoute = Router();

landingPageRoute.get('/investigations/:orderBy', (request: Request, response: Response) => {
    const getInvestigationsParameters = {
        userId: response.locals.user.id,
        orderBy: request.params.orderBy
    };
    const investigationsLogger = logger.setup({
        workflow: 'Getting Investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigationsLogger.info(`launching graphql API request with parameters ${JSON.stringify(getInvestigationsParameters)}`, Severity.LOW);
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {
            if (result && result.data && result.data.userInvestigationsSort &&
                result.data.userInvestigationsSort.json) {
                investigationsLogger.info('got investigations from the DB', Severity.LOW);
                response.send(JSON.parse(result.data.userInvestigationsSort.json))
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

landingPageRoute.get('/groupInvestigations/:orderBy', adminMiddleWare, (request: Request, response: Response) => {
    const getInvestigationsParameters = {
        filter: {userByCreator: {countyByInvestigationGroup: {id: {equalTo: +response.locals.user.investigationGroup}}}},
        orderBy: request.params.orderBy,
        offset: 0,
        size: 100
    };
    const groupInvestigationsLogger = logger.setup({
        workflow: 'Getting Investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(ORDERED_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {
            if (result && result.data && result.data.orderedInvestigations &&
                result.data.orderedInvestigations.nodes) {
                groupInvestigationsLogger.info('got results from the DB', Severity.LOW);
                response.send({allInvestigations: convertOrderedInvestigationsData(result.data)});
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
                const convertedStatuses: string[] = result.data.allInvestigationStatuses.nodes.map(status => status.displayName);
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