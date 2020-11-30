import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_GROUPED_INVESTIGATIONS_REASONS, GET_INVESTIGATIONS_BY_GROUP_ID } from '../../DBService/GroupedInvestigations/Query';
import { CREATE_GROUP_FOR_INVESTIGATIONS } from '../../DBService/GroupedInvestigations/Mutation';

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
            const groupedInvestigationsGrouped = result.data.allInvestigationGroupReasons
            reasonsLogger.info('query reasons successfully', Severity.LOW);
            response.send(groupedInvestigationsGrouped);
        } else {
            reasonsLogger.error(`failed to fetch reasons due to ${JSON.stringify(result.error[0]?.message)}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
        }
    }).catch((error) => {
        reasonsLogger.error(`failed to fetch reasons due to ${error}`, Severity.HIGH);
        response.status(errorStatusCode).json({ error: 'failed to fetch reasons' });
    });
});

groupedInvestigationsRoute.post('/', adminMiddleWare, (request: Request, response: Response) => {
    const invetigationsToGroup: number[] = request.body.invetigationsToGroupIds;
    const invetigationsToGroupMessage = invetigationsToGroup.join(', ');
    const groupToCreateLogger = logger.setup({
        workflow: `create grouped investigations ${invetigationsToGroupMessage}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })

    const groupToCreate = { ...request.body.groupToCreate, epidemiologyNumbers: invetigationsToGroup };
    groupToCreateLogger.info(`launching create grouped investigations request with the parameters ${JSON.stringify(groupToCreate)}`, Severity.LOW);
    graphqlRequest(CREATE_GROUPED_INVESTIGATIONS, response.locals, {input: groupToCreate})
    .then(result => {
        if (result?.data) {
            groupToCreateLogger.info('grouped investigations creation was successfull', Severity.LOW);
            response.send(result);
        } else {
            groupToCreateLogger.error(`grouped investigations creation failed due to ${result.errors[0]?.message}`, Severity.HIGH);
            response.status(errorStatusCode).send(result.errors[0]?.message);
        }
    })
    .catch(err => {
        groupToCreateLogger.error(`grouped investigations creation failed due to ${err}`, Severity.HIGH);
        response.status(errorStatusCode).send(err);
    })
})

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

export default groupedInvestigationsRoute;