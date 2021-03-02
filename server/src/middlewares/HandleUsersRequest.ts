import { NextFunction, Request, Response } from 'express';

import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { DISTRICT_COUNTY_BY_USER } from '../DBService/Users/Query';
import { graphqlRequest, unauthorizedStatusCode } from '../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../Logger/Logger';

const handleUsersRequest = async (request: Request, response: Response, next: NextFunction) => {
    const currentUser = response.locals.user;
    const { userType } = currentUser;
    const { userId } = request.body;

    const usersMiddlewareLogger = logger.setup({
        workflow: 'InvestigationMiddleware',
        investigation: currentUser.epidemiologynumber,
    });

    const questionedUser = await getUserDistrictCounty(userId, response.locals);
    if (userType === UserType.SUPER_ADMIN) {
        if (currentUser.countyByInvestigationGroup.districtId === questionedUser.countyByInvestigationGroup.districtId) {
            usersMiddlewareLogger.info(
                'requesting user is super admin and questioned user is in user district , redirecting',
                Severity.LOW
            );
            return next();
        }
        usersMiddlewareLogger.warn(
            'requesting user is super admin and questioned user is not in user district , returning auth error',
            Severity.HIGH
        );
        return response.sendStatus(unauthorizedStatusCode);
    } else if (userType === UserType.ADMIN) {
        if (currentUser.investigationGroup === questionedUser.investigationGroup) {
            usersMiddlewareLogger.info('requesting user is admin and questioned user is in user group, redirecting', Severity.LOW);
            return next();
        }
        usersMiddlewareLogger.warn(
            'requesting user is admin and questioned user is not in user group, returning auth error',
            Severity.HIGH
        );
        return response.sendStatus(unauthorizedStatusCode);
    } else {
        usersMiddlewareLogger.warn(
            'user is not admin nor super admin and requested user permitted action, returning auth error',
            Severity.HIGH
        );
        return response.sendStatus(unauthorizedStatusCode);
    }
};

const getUserDistrictCounty = async (id: number, locals: any) => {
    const districtByUserLogger = logger.setup({
        workflow: 'districtByUser',
        user: locals.user.id,
    });

    districtByUserLogger.info(launchingDBRequestLog(id), Severity.LOW);
    const userDetails = await graphqlRequest(DISTRICT_COUNTY_BY_USER, locals, { id })
        .then((result: any) => {
            districtByUserLogger.info(validDBResponseLog, Severity.LOW);
            return result.data.userById;
        })
        .catch((error) => {
            districtByUserLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            return {};
        });
    return userDetails;
};

export default handleUsersRequest;
