import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {ALL_INVESTIGATION_STATS} from '../../DBService/AdminLandingPage/Query';
import {InvestigationStatNode} from '../../Models/AdminLandingPage/InvestigationStatNode';

const adminLandingPageRoute = Router();
const errorStatusCode = 500;

adminLandingPageRoute.get('/stats', async (request: Request, response: Response) => {
    const {user} = response.locals;
    const {districtId} = user.countyByInvestigationGroup
    const filterBy = {

    }
    const adminStatsLogger = logger.setup({
        workflow: 'Fetching Occupations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    adminStatsLogger.info('launching DB request', Severity.LOW);

    const {data , err} = await fetchAllInvestigationStats(response.locals , {districtId});
    if(err) {
        response.sendStatus(errorStatusCode);
    }
    response.send(data);

});

const fetchAllInvestigationStats = async (locals : any, params : any) => {
    return await graphqlRequest(ALL_INVESTIGATION_STATS, locals, params).then((result: any) => {
        return result.data && !result.errors 
        ? {data : result.data.allInvestigations.edges}
        : {err : result.errors} 
    }).catch(err => {
        return {
            data : {},
            err
        }
    });
}

const NEW_INVESTIGATION_STATUS = 1;
const ACTIVE_INVESTIGATION_STATUS = 100000002;

const getColumnStats = (investigations: InvestigationStatNode[]) => {
    let nonActiveCount: number, nonAssignedCount: number, newCount: number, activeCount: number;
    nonActiveCount = nonAssignedCount = newCount = activeCount = 0;

    investigations.forEach((investigation) => {
        const { investigationStatus , userByCreator} = investigation.node;
        if (investigationStatus === 1) {
            newCount++;
            //if()
        }
        //if (node.userByCreator)
    });
};


export default adminLandingPageRoute;