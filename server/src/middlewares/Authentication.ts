import { NextFunction, Request, Response } from 'express';

import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { GET_USER_BY_ID } from '../DBService/Users/Query';
import { errorStatusCode, graphqlRequest } from '../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../Logger/Logger';

const stubUsers = {
    'fake token!': {
        id: '7',
        name: 'stubuser',

    },
    'demo token': {
        id: '1',
        name: 'XXXXXX',
    }
};

const handleConfidentialAuth = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const userUpn = request.headers.authorization;
    const userId =  userUpn.split('@')[0];
    const authenticationLogger = logger.setup({
        workflow: 'Authentication',
        investigation: +request.headers.epidemiologynumber
    });
    if (!userUpn) {
        authenticationLogger.error('got no user at all', Severity.MEDIUM);
        return response.status(401).json({ error: "unauthorized prod user" });
    }
    authenticationLogger.info(`authorized azure upn successfully! got user: ${JSON.stringify(userId)}`, Severity.LOW);
    
    const parameters = { id: userId };
    authenticationLogger.info(`get user by id: ${launchingDBRequestLog(parameters)}`, Severity.LOW);

    graphqlRequest(GET_USER_BY_ID, response.locals, parameters).then((result: any) => {
        authenticationLogger.info(validDBResponseLog, Severity.LOW);
        response.locals.user = {
            id: userId,
            name: result.data.userById?.userName,
            userType: result.data.userById?.userType,
            investigationGroup: result.data.userById?.investigationGroup,
            countyByInvestigationGroup: {
                districtId: result.data.userById?.countyByInvestigationGroup?.districtId
            }
        };
        return next();
    }).catch(error => {
        authenticationLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });;
}

const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    response.locals.epidemiologynumber = request.headers.epidemiologynumber;
    const authenticationLogger = logger.setup({
        workflow: 'Authentication',
        investigation: +request.headers.epidemiologynumber
    });
    if (process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'prod') {
        authenticationLogger.info('authenticating with the azure recived upn', Severity.LOW);
        return handleConfidentialAuth(request, response, next);
    } else {
        authenticationLogger.info('authenticating with the stubuser recived upn', Severity.LOW);
        const token = request.headers.authorization;
        const user = stubUsers[token as keyof typeof stubUsers];
        if (!user) {
            authenticationLogger.error(`fake user doesn't exist got the upn: ${token}`, Severity.HIGH);
            return response.status(401).json({ error: "unauthorized noauth user" });
        } else {
            authenticationLogger.info(`noauth user found successfully, the user is: ${JSON.stringify(user)}`, Severity.LOW);
            const parameters = { id: user.id };
            authenticationLogger.info(`get user by id: ${launchingDBRequestLog(parameters)}`, Severity.LOW);
            graphqlRequest(GET_USER_BY_ID, response.locals, parameters)
            .then((result: any) => {
                authenticationLogger.info(validDBResponseLog, Severity.LOW);
                response.locals.user = {
                    ...user,
                    userType: result.data.userById?.userType,
                    investigationGroup: result.data.userById?.investigationGroup,
                    countyByInvestigationGroup: {
                        districtId: result.data.userById?.countyByInvestigationGroup?.districtId
                    }
                };
                return next();
            }).catch(error => {
                authenticationLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.sendStatus(errorStatusCode).send(error);
            });;

        }
    }
};

export const adminMiddleWare = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const adminLogger = logger.setup({
        workflow: 'Admin validation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    if (response.locals.user.userType === UserType.ADMIN ||
        response.locals.user.userType === UserType.SUPER_ADMIN) {
            adminLogger.info('the requested user is admin', Severity.LOW);
            return next();
    } else {
        adminLogger.error('the user is not admin!', Severity.MEDIUM);
        response.status(401).json({ error: "unauthorized non admin user" })
    }
};

export const superAdminMiddleWare = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const adminLogger = logger.setup({
        workflow: 'Super admin validation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    if (response.locals.user.userType === UserType.SUPER_ADMIN) {
        adminLogger.info('the requested user is super admin', Severity.LOW);
        return next();
    } else {
        adminLogger.error('the user is not super admin!', Severity.MEDIUM);
        response.status(401).json({ error: "unauthorized non super admin user" })
    }
};
export default authMiddleware;
