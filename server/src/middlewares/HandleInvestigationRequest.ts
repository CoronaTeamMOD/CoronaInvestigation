import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { graphqlRequest } from '../GraphqlHTTPRequest';
import { GET_INVESTIGATION_CREATOR } from '../DBService/InvestigationInfo/Query';

export const handleInvestigationRequest = async (request: Request, response: Response, next: NextFunction) => {
    const { user } = response.locals;
    const epidemiologynumber = parseInt(response.locals.epidemiologynumber);

    const InvestigationMiddlewareLogger = logger.setup({
        workflow: 'InvestigationMiddleware',
        investigation: +request.headers.epidemiologynumber,
    });

    if (isNaN(epidemiologynumber)) {
        InvestigationMiddlewareLogger.info('client sent investigation request with no epidemiology number', Severity.MEDIUM);
        return response.status(401).json({ error: 'no epidemiology number supplied' });
    }

    InvestigationMiddlewareLogger.info('getting current investigation details from DB', Severity.LOW);
    const { investigationGroup, id , err} = await fetchInvestigationCreatorDetails(response.locals , epidemiologynumber , logger)
    if(investigationGroup === -1) {
        InvestigationMiddlewareLogger.info(`error in requesting the graphql API: ${err}`, Severity.HIGH);
        response.sendStatus(500);
    }
    InvestigationMiddlewareLogger.info('got investigation details', Severity.LOW);

    if (user.userType === UserType.ADMIN || user.userType === UserType.SUPER_ADMIN) {
        if (user.countyByInvestigationGroup.districtId === investigationGroup) {
            InvestigationMiddlewareLogger.info('user is admin and investigation is in his county', Severity.LOW);
            return next();
        }
        InvestigationMiddlewareLogger.info('user is admin but investigation is not in his county , returning 401', Severity.HIGH);
        return response.status(401).json({ error: "unauthorized user - investigation is not in user's investigation group" });
    } else {
        if (user.id === id) {
            InvestigationMiddlewareLogger.info('user is creator of the investigation', Severity.LOW);
            return next();
        }
        InvestigationMiddlewareLogger.info('user is not admin nor creator of the investigation , returning 401', Severity.HIGH);
        return response.status(401).json({ error: 'unauthorized user - user is not creator' });
    }
};

const fetchInvestigationCreatorDetails = async (locals : any , epidemiologynumber : number , logger : any) : Promise<{investigationGroup : number , id : string , err? : any}>=> {
    const investigationCreatorDetails = await graphqlRequest(GET_INVESTIGATION_CREATOR, locals, { epidemiologynumber })
    .then((result: any) => {
        
        return result.data?.investigationByEpidemiologyNumber?.userByCreator;
    })
    .catch((err) => {
        return {
            investigationGroup : -1,
            id: "N/A",
            err
        }
    });
    return investigationCreatorDetails;
}
