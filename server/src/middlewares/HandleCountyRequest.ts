import { NextFunction, Request, Response } from 'express';

import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { DISTRICT_BY_COUNTY } from '../DBService/Counties/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../Logger/Logger';
import { graphqlRequest, unauthorizedStatusCode } from '../GraphqlHTTPRequest';

const handleCountyRequest = async (request: Request, response: Response, next: NextFunction) => {
    const currentUser = response.locals.user;
    const { userType } = currentUser;
    const county = parseInt(request.body.county);

    const countyMiddlewareLogger = logger.setup({
        workflow: 'countyMiddleware',
        investigation: currentUser.epidemiologynumber,
    });

    if (userType === UserType.SUPER_ADMIN) {
        const district = await getUserDistrict(county , response.locals);

        if(currentUser.countyByInvestigationGroup.districtId === district) {
            countyMiddlewareLogger.info(
                'user is super admin and county is in user district, redirecting',
                Severity.LOW
            )
            return next();
        }
        countyMiddlewareLogger.warn(
            'user is super admin but county is not in user district, returning auth error',
            Severity.HIGH
        )
        return response.sendStatus(unauthorizedStatusCode);
    } else if (userType === UserType.ADMIN) {
        if (currentUser.investigationGroup === county) {
            countyMiddlewareLogger.info(
                'user is admin and county is users, redirecting',
                Severity.LOW
            )
            return next()
        }
        countyMiddlewareLogger.warn(
            'user is admin but county is not users county, returning auth error',
            Severity.HIGH
        )
        return response.sendStatus(unauthorizedStatusCode);
    } else {
        countyMiddlewareLogger.info(
            'user is not admin nor super admin and requested county permitted action, returning auth error',
            Severity.HIGH
        );
        return response.sendStatus(unauthorizedStatusCode);
    }
};

const getUserDistrict = async (countyId: number, locals: any) => {
    const districtByUserLogger = logger.setup({
        workflow: 'districtByUser',
        user: locals.user.id,
    });

    districtByUserLogger.info(launchingDBRequestLog(countyId), Severity.LOW);
    const userDetails = await graphqlRequest(DISTRICT_BY_COUNTY, locals, { id : countyId })
        .then((result: any) => {
            districtByUserLogger.info(validDBResponseLog, Severity.LOW);
            return result.data.countyById.districtId;
        })
        .catch((error) => {
            districtByUserLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            return {};
        });
    return userDetails;
};

export default handleCountyRequest;
