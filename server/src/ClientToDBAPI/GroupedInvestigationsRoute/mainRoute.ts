import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_GROUPED_INVESTIGATIONS_REASONS, GET_INVESTIGATIONS_BY_GROUP_ID } from '../../DBService/GroupedInvestigations/Query';
import { CREATE_GROUPED_INVESTIGATIONS, DISBAND_GROUP_IDS } from '../../DBService/GroupedInvestigations/Mutation';

const groupedInvestigationsRoute = Router();
const errorStatusCode = 500;

groupedInvestigationsRoute.get('/reasons', adminMiddleWare, (request: Request, response: Response) => {
    const reasonsLogger = logger.setup({
        workflow: 'query reasons for grouped investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    reasonsLogger.info('requesting the graphql API to query reasons', Severity.LOW);
    graphqlRequest(GET_GROUPED_INVESTIGATIONS_REASONS, response.locals).then((result: any) => {
        if (result?.data?.allInvestigationGroupReasons) {
            const groupedInvestigationsReasons = result.data.allInvestigationGroupReasons
            reasonsLogger.info('query reasons successfully', Severity.LOW);
            response.send(groupedInvestigationsReasons);
        } else {
            reasonsLogger.error(`failed to fetch reasons due to ${JSON.stringify(result.error[0]?.message)}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
        }
    }).catch((error) => {
        reasonsLogger.error(`failed to fetch reasons due to ${error}`, Severity.HIGH);
        response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
    });
});

groupedInvestigationsRoute.get('/:groupId', adminMiddleWare, (request: Request, response: Response) => {
    const investigationsByGroupIdLogger = logger.setup({
        workflow: `get investigations by group id ${request.params.groupId}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    investigationsByGroupIdLogger.info('requesting the graphql API to query reasons', Severity.LOW);
    graphqlRequest(GET_INVESTIGATIONS_BY_GROUP_ID, response.locals, { groupId: request.params.groupId }).then((result: any) => {
        if (result?.data?.allInvestigations) {
            const groupedInvestigationsGrouped = result.data.allInvestigations
            investigationsByGroupIdLogger.info('query investigations by group id successfully', Severity.LOW);
            response.send(groupedInvestigationsGrouped);
        } else {
            investigationsByGroupIdLogger.error(`failed to fetch reasons due to ${JSON.stringify(result.error[0]?.message)}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
        }
    }).catch((error) => {
        investigationsByGroupIdLogger.error(`failed to fetch reasons due to ${error}`, Severity.HIGH);
        response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
    });
});

groupedInvestigationsRoute.post('/', adminMiddleWare, (request: Request, response: Response) => {
    const invetigationsToGroup: number[] = request.body.invetigationsToGroupIds;
    const groupedInvestigationsLogger = logger.setup({
        workflow: `create grouped investigations ${invetigationsToGroup.join(', ')}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    const groupedInvestigationsToCreate = {...request.body.groupToCreate, epidemiologyNumbers: invetigationsToGroup}; 
    groupedInvestigationsLogger.info(`launching create grouped investigations request with the parameters ${JSON.stringify(groupedInvestigationsToCreate)}`, Severity.LOW);
    graphqlRequest(CREATE_GROUPED_INVESTIGATIONS, response.locals, {input: groupedInvestigationsToCreate})
    .then(result => {
        if (result?.data) {
            groupedInvestigationsLogger.info('grouped investigations creation was successful', Severity.LOW);
            response.send(result);
        } else {
            groupedInvestigationsLogger.error(`grouped investigations creation failed due to ${result.errors[0]?.message}`, Severity.HIGH);
            response.status(errorStatusCode).send(result.errors[0]?.message);
        }
    })
    .catch(err => {
        groupedInvestigationsLogger.error(`grouped investigations creation failed due to ${err}`, Severity.HIGH);
        response.status(errorStatusCode).send(err);
    })
})

groupedInvestigationsRoute.post('/disband', adminMiddleWare, (request: Request, response: Response) => {
    const groupIdsToDisband = request.body.groupIdsToDisband;
    const groupIdsToDisbandLogger = logger.setup({
        workflow: `disband group ids ${groupIdsToDisband.join(', ')}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    groupIdsToDisbandLogger.info('launching disband group ids request', Severity.LOW);
    graphqlRequest(DISBAND_GROUP_IDS, response.locals, { groupIds: groupIdsToDisband })
    .then(result => {
        if (result?.data) {
            groupIdsToDisbandLogger.info('group ids disbandation was successful', Severity.LOW);
            response.send(result);
        } else {
            groupIdsToDisbandLogger.error(`group ids disbandation failed due to  ${result.errors[0]?.message}`, Severity.HIGH);
            response.status(errorStatusCode).send(result.errors[0]?.message);
        }
    })
    .catch(err => {
        groupIdsToDisbandLogger.error(`group ids disbandation failed due to  ${err}`, Severity.HIGH);
        response.status(errorStatusCode).send(err);
    })
})

export default groupedInvestigationsRoute;