import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_GROUPED_INVESTIGATIONS_REASONS } from '../../DBService/GroupedInvestigations/Query';
import { CREATE_GROUP_FOR_INVESTIGATIONS, UPDATE_GROUPED_INVESTIGATIONS } from '../../DBService/GroupedInvestigations/Mutation';

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
    const groupToCreateLogger = logger.setup({
        workflow: 'create group for investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    const groupToCreate = request.body.groupToCreate; 
    groupToCreateLogger.info(`launching create group info with the parameters ${JSON.stringify(groupToCreate)}`, Severity.LOW);
    graphqlRequest(CREATE_GROUP_FOR_INVESTIGATIONS, response.locals, {input: groupToCreate})
    .then(result => {
        if (result?.data) {
            groupToCreateLogger.info('create group successfully', Severity.LOW);
            const groupedInvestigationsLogger = logger.setup({
                workflow: 'update groupId for investigations',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            })
            const invetigationsToGroup: number[] = request.body.invetigationsToGroupIds;
            const invetigationsToGroupMessage = invetigationsToGroup.join(', ');
            groupedInvestigationsLogger.info(`updating investigations ${invetigationsToGroupMessage} to be part of group ${groupToCreate.id}`, Severity.LOW);
            graphqlRequest(UPDATE_GROUPED_INVESTIGATIONS, response.locals, {
                epidemiologyNumbers: invetigationsToGroup,
                groupId: groupToCreate.id
            })
            .then(result => {
                if (result?.data?.updateGroupedInvestigations) {
                    groupedInvestigationsLogger.info(`investigations ${invetigationsToGroupMessage} were updated successfully`, Severity.LOW);
                    console.log(result);
                    response.send(result);
                } else {
                    groupedInvestigationsLogger.error(`investigations ${invetigationsToGroupMessage} were failed to update due to ${result.errors[0]?.message}`, Severity.HIGH);
                    response.status(errorStatusCode).send(result.errors[0]?.message);
                }
            })
            .catch(err => {
                groupedInvestigationsLogger.error(`investigations ${invetigationsToGroupMessage} were failed to update due to ${err}`, Severity.HIGH);
                response.status(errorStatusCode).send(err);
            })
        } else {
            groupToCreateLogger.error(`create group was failde due to ${result.errors[0]?.message}`, Severity.HIGH);
            response.status(errorStatusCode).send(result.errors[0]?.message);
        }
    })
    .catch(err => {
        groupToCreateLogger.error(`create group was failde due to ${err}`, Severity.HIGH);
        response.status(errorStatusCode).send(err);
    })

})

export default groupedInvestigationsRoute;