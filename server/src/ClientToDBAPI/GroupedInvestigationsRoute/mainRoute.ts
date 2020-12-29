import { Router, Request, Response } from 'express';

import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import { GET_GROUPED_INVESTIGATIONS_REASONS, GET_INVESTIGATIONS_BY_GROUP_ID } from '../../DBService/GroupedInvestigations/Query';
import { CREATE_GROUPED_INVESTIGATIONS, EXCLUDE_FROM_GROUP, DISBAND_GROUP_IDS, UPDATE_GROUPED_INVESTIGATIONS } from '../../DBService/GroupedInvestigations/Mutation';
import { convertGroupedInvestigationsData } from './utils';

const groupedInvestigationsRoute = Router();

groupedInvestigationsRoute.get('/reasons', adminMiddleWare, (request: Request, response: Response) => {
    const reasonsLogger = logger.setup({
        workflow: 'query reasons for grouped investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    reasonsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_GROUPED_INVESTIGATIONS_REASONS, response.locals)
    .then(result => {
        reasonsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allInvestigationGroupReasons);
    }).catch((error) => {
        reasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

groupedInvestigationsRoute.get('/:groupId', adminMiddleWare, (request: Request, response: Response) => {
    const investigationsByGroupIdLogger = logger.setup({
        workflow: `get investigations by group id`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })

    const parameters = { groupId: request.params.groupId };
    investigationsByGroupIdLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATIONS_BY_GROUP_ID, response.locals, parameters)
    .then((result: any) => {
        result.data.orderedInvestigations = result.data.allInvestigations
        const groupedInvestigationsGrouped = convertGroupedInvestigationsData(result.data); 
        investigationsByGroupIdLogger.info(validDBResponseLog, Severity.LOW);
        response.send(groupedInvestigationsGrouped);
    }).catch((error) => {
        investigationsByGroupIdLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

groupedInvestigationsRoute.post('/exclude', adminMiddleWare, (request: Request, response: Response) => {
    const InvestigationToExcludeLogger = logger.setup({
        workflow: `exclude investigation from its group`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })

    const parameters = { investigationToExclude: request.body.investigationToExclude }
    InvestigationToExcludeLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(EXCLUDE_FROM_GROUP, response.locals, parameters)
        .then(result => {
            InvestigationToExcludeLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            InvestigationToExcludeLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
})

groupedInvestigationsRoute.post('/', adminMiddleWare, (request: Request, response: Response) => {
    const invetigationsToGroup: number[] = request.body.invetigationsToGroup;
    const group: string | Object = request.body.group;
    if (typeof group === 'object') {
        const groupedInvestigationsLogger = logger.setup({
            workflow: `create grouped investigations`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        })
        const parameters = {input: { ...request.body.group, epidemiologyNumbers: invetigationsToGroup }};
        groupedInvestigationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
        graphqlRequest(CREATE_GROUPED_INVESTIGATIONS, response.locals, parameters)
            .then(result => {
                groupedInvestigationsLogger.info(validDBResponseLog, Severity.LOW);
                response.send(result);
            })
            .catch(error => {
                groupedInvestigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.status(errorStatusCode).send(error);
            })
    } else {
        const groupedInvestigationsLogger = logger.setup({
            workflow: `update grouped investigations`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        })
        const groupId: string = request.body.group;
        const parameters = {input: { epidemiologyNumbers: invetigationsToGroup, val: groupId }};
        groupedInvestigationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
        graphqlRequest(UPDATE_GROUPED_INVESTIGATIONS, response.locals, parameters)
            .then(result => {
                groupedInvestigationsLogger.info(validDBResponseLog, Severity.LOW);
                response.send(result);
            })
            .catch(error => {
                groupedInvestigationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.status(errorStatusCode).send(error);
            })
    }
})

groupedInvestigationsRoute.post('/disband', adminMiddleWare, (request: Request, response: Response) => {
    const groupIdsToDisbandLogger = logger.setup({
        workflow: `disband group ids`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })

    const parameters = { groupIds: request.body.groupIdsToDisband }
    groupIdsToDisbandLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(DISBAND_GROUP_IDS, response.locals, parameters)
        .then(result => {
            groupIdsToDisbandLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            groupIdsToDisbandLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
})

export default groupedInvestigationsRoute;