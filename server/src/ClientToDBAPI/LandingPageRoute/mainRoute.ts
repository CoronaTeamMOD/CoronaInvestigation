import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Service, Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { CHANGE_DESK_ID } from '../../DBService/LandingPage/Mutation';
import GetAllInvestigationStatuses from '../../Models/InvestigationStatus/GetAllInvestigationStatuses';
import { graphqlRequest, multipleInvestigationsBulkErrorMessage, areAllResultsValid } from '../../GraphqlHTTPRequest';
import { GET_USER_INVESTIGATIONS, GET_GROUP_INVESTIGATIONS, GET_ALL_INVESTIGATION_STATUS } from '../../DBService/LandingPage/Query';

const errorStatusResponse = 500;

const landingPageRoute = Router();

landingPageRoute.get('/investigations/:orderBy', (request: Request, response: Response) => {
    const getInvestigationsParameters = {
        userId: response.locals.user.id,
        orderBy: request.params.orderBy
    };
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Investigations',
        step: `launching graphql API request with parameters ${JSON.stringify(getInvestigationsParameters)}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {
            if (result && result.data && result.data.userInvestigationsSort &&
                result.data.userInvestigationsSort.json) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting Investigations',
                    step: 'got investigations from the DB',
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                });
                response.send(JSON.parse(result.data.userInvestigationsSort.json))
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting Investigations',
                    step: `got errors in querying the investigations from the DB ${JSON.stringify(result)}`,
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                });
                response.status(errorStatusResponse).send('error in fetching data')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Investigations',
                step: `got errors in request to graphql API ${err}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusResponse).send('error in fetching data: ' + err);
        });
})

landingPageRoute.get('/groupInvestigations/:orderBy', adminMiddleWare, (request: Request, response: Response) => {
    const getInvestigationsParameters = {
        investigationGroupId: +response.locals.user.investigationGroup,
        orderBy: request.params.orderBy
    };
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Investigations',
        step: `launching graphql API group investigations request with parameters ${JSON.stringify(getInvestigationsParameters)}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GET_GROUP_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {

            if (result && result.data && result.data.groupInvestigationsSort &&
                result.data.groupInvestigationsSort.json) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting Investigations',
                    step: 'got results from the DB',
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                })
                response.send(JSON.parse(result.data.groupInvestigationsSort.json))
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Getting Investigations',
                    step: `got error in querying the DB ${JSON.stringify(result)}`,
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                });
                response.send(result)
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting Investigations',
                step: `got error in requesting the graphql API ${err}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusResponse).send('error in fetching data: ' + err)
        });
})

landingPageRoute.get('/investigationStatuses', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Investigations statuses',
        step: `launching graphql API investigationStatuses request`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GET_ALL_INVESTIGATION_STATUS, response.locals)
        .then((result: GetAllInvestigationStatuses) => {
            if (result?.data?.allInvestigationStatuses) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting Investigation statuses',
                    step: 'got results from the DB',
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                })
                const convertedStatuses: string[] = result.data.allInvestigationStatuses.nodes.map(status => status.displayName);
                response.send(convertedStatuses);
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Getting Investigation statuses',
                    step: `got error in querying the DB ${JSON.stringify(result)}`,
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                });
                response.status(errorStatusResponse).send('error in fetching data')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting Investigation statuses',
                step: `got error in requesting the graphql API ${err}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusResponse).send('error in fetching data: ' + err)
        });
})

landingPageRoute.post('/changeDesk', adminMiddleWare, (request: Request, response: Response) => {
    const epidemiologyNumbers: number[] = request.body.epidemiologyNumbers;
    const updatedDesk: number = request.body.updatedDesk;
    const transferReason: number = request.body.transferReason;

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Change desk id',
        step: `launching graphql API desks request`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    Promise.all(epidemiologyNumbers.map(epidemiologyNumber => graphqlRequest(CHANGE_DESK_ID, response.locals, {epidemiologyNumber, updatedDesk, transferReason})))
    .then((results: any[]) => {
        if (areAllResultsValid(results)) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Change desk id',
                step: `desk id has been changed in the DB, investigations: ${epidemiologyNumbers}`,
                user: response.locals.user.id
            });
            response.send(results[0]?.data || '');
        } else {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Change desk id',
                step: `desk id hasnt been changed in the DB in investigations ${epidemiologyNumbers}, due to: ${multipleInvestigationsBulkErrorMessage(results, epidemiologyNumbers)}`,
                user: response.locals.user.id
            });
            response.sendStatus(errorStatusResponse);
        }
    }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Change desk id',
                step: `querying the graphql API failed du to ${err}`,
                investigation: response.locals.epidemiologyNumber,
                user: response.locals.user.id
            });
            response.sendStatus(errorStatusResponse);
        });
})

export default landingPageRoute;