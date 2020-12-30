import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { GET_INVESTIGATION_CREATOR } from '../DBService/InvestigationInfo/Query';
import { errorStatusCode, graphqlRequest, unauthorizedStatusCode } from '../GraphqlHTTPRequest';

export const handleInvestigationRequest = async (request: Request, response: Response, next: NextFunction) => {
    const { user } = response.locals;
    const epidemiologynumber = parseInt(response.locals.epidemiologynumber);

    const investigationMiddlewareLogger = logger.setup({
        workflow: 'InvestigationMiddleware',
        investigation: epidemiologynumber,
    });

    if (isNaN(epidemiologynumber)) {
        investigationMiddlewareLogger.info('client sent investigation request with no epidemiology number', Severity.MEDIUM);
        return response.status(unauthorizedStatusCode).json({ error: 'no epidemiology number supplied' });
    }

    investigationMiddlewareLogger.info('getting current investigation details from DB', Severity.LOW);
    const { investigationGroup, id , err} = await fetchInvestigationCreatorDetails(response.locals , epidemiologynumber);
    if(err) {
        investigationMiddlewareLogger.info(`error in requesting the graphql API: ${err}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    }
    investigationMiddlewareLogger.info('got investigation details', Severity.LOW);

    if (user.userType === UserType.ADMIN || user.userType === UserType.SUPER_ADMIN) {
        if (user.countyByInvestigationGroup.districtId === investigationGroup) {
            investigationMiddlewareLogger.info('user is admin and investigation is in his county', Severity.LOW);
            return next();
        }
        investigationMiddlewareLogger.info('user is admin but investigation is not in his county , returning 401', Severity.HIGH);
        return response.status(unauthorizedStatusCode).json({ error: "unauthorized user - investigation is not in user's investigation group" });
    } else {
        if (user.id === id) {
            investigationMiddlewareLogger.info('user is creator of the investigation', Severity.LOW);
            return next();
        }
        investigationMiddlewareLogger.info('user is not admin nor creator of the investigation , returning 401', Severity.HIGH);
        return response.status(unauthorizedStatusCode).json({ error: 'unauthorized user - user is not creator' });
    }
};

const fetchInvestigationCreatorDetails = async (locals : any , epidemiologynumber : number) : Promise<{investigationGroup : number , id : string , err? : any}>=> {
    return await graphqlRequest(GET_INVESTIGATION_CREATOR, locals, { epidemiologynumber })
    .then(result => {
        return  result.data.investigationByEpidemiologyNumber.userByCreator;
    })
    .catch((err) => {
        return { err }
    });
}
