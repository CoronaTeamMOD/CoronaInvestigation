import { NextFunction, Request, Response } from 'express';

import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { GET_INVESTIGATION_CREATOR } from '../DBService/InvestigationInfo/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../Logger/Logger';
import { errorStatusCode, graphqlRequest, unauthorizedStatusCode, initialEpidemiologyNumberByRedux } from '../GraphqlHTTPRequest';

export const handleInvestigationRequest = async (request: Request, response: Response, next: NextFunction) => {
    const { user } = response.locals;
    const epidemiologynumber = response.locals.epidemiologynumber !== String(initialEpidemiologyNumberByRedux)
    ? parseInt(response.locals.epidemiologynumber)
    : parseInt(request.body.epidemiologyNumber);
    const investigationMiddlewareLogger = logger.setup({
        workflow: 'InvestigationMiddleware',
        investigation: epidemiologynumber,
    });

    if (isNaN(epidemiologynumber)) {
        investigationMiddlewareLogger.info('client sent investigation request with no epidemiology number', Severity.MEDIUM);
        return response.status(unauthorizedStatusCode).json({ error: 'no epidemiology number supplied' });
    }

    if (epidemiologynumber === initialEpidemiologyNumberByRedux) {
        investigationMiddlewareLogger.info('the epidemiology number wasnt loaded yet', Severity.MEDIUM);
        return response.status(unauthorizedStatusCode).json({ error: 'no epidemiology number supplied' });
    }

    investigationMiddlewareLogger.info(launchingDBRequestLog({ epidemiologynumber }), Severity.LOW);
    const { investigationGroup, id , err, districtId } = await fetchInvestigationCreatorDetails(response.locals , epidemiologynumber);
    if(err) {
        investigationMiddlewareLogger.info(invalidDBResponseLog(err), Severity.HIGH);
        response.sendStatus(errorStatusCode).json({ error: invalidDBResponseLog(err) });
    }
    investigationMiddlewareLogger.info(validDBResponseLog, Severity.LOW);

    if (user.userType === UserType.ADMIN) {
        if (user.investigationGroup === investigationGroup) {
            investigationMiddlewareLogger.info('user is admin and investigation is in his county', Severity.LOW);
            return next();
        }
        investigationMiddlewareLogger.info('user is admin but investigation is not in his county , returning 401', Severity.HIGH);
        return response.status(unauthorizedStatusCode).json({ error: "unauthorized user - investigation is not in user's investigation group" });
    }  else if (user.userType === UserType.SUPER_ADMIN) {
        if (user.countyByInvestigationGroup.districtId === districtId) {
            investigationMiddlewareLogger.info('user is  super admin and investigation is in his district', Severity.LOW);
            return next();
        }
        investigationMiddlewareLogger.info('user is super admin but investigation is not in his district , returning 401', Severity.HIGH);
        return response.status(unauthorizedStatusCode).json({ error: "unauthorized user - investigation is not in user's district" });
    } else {
        if (user.id === id) {
            investigationMiddlewareLogger.info('user is creator of the investigation', Severity.LOW);
            return next();
        }
        investigationMiddlewareLogger.info('user is not admin nor creator of the investigation , returning 401', Severity.HIGH);
        return response.status(unauthorizedStatusCode).json({ error: 'unauthorized user - user is not creator' });
    }
};

const fetchInvestigationCreatorDetails = async (locals : any , epidemiologynumber : number) : Promise<{investigationGroup : number , id : string, districtId: number, err? : any}>=> {
    return await graphqlRequest(GET_INVESTIGATION_CREATOR, locals, { epidemiologynumber })
    .then(result => {
        return  result.data.investigationByEpidemiologyNumber?.userByCreator ?
        {...result.data.investigationByEpidemiologyNumber?.userByCreator, districtId: result.data.investigationByEpidemiologyNumber?.userByCreator.districtId?.districtId}
        : { err : 'investigation wasnt found' };
    })
    .catch((err) => {
        return { err }
    });
}
