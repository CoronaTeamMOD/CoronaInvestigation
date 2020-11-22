import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';

import { graphqlRequest } from '../GraphqlHTTPRequest';
import { GET_USER_BY_ID } from '../DBService/Users/Query';


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

        authenticationLogger.info(`request to the graphql API with parameters: ${userId}`, Severity.LOW);

        graphqlRequest(GET_USER_BY_ID, response.locals, { id: userId }).then((result: any) => {
            authenticationLogger.info('fetched user by id successfully', Severity.LOW);
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
        }).catch(err => {
            authenticationLogger.error(`error in requesting the graphql API: ${err}`, Severity.HIGH);
            response.sendStatus(500);
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

            authenticationLogger.info(`request to the graphql API with parameters: ${user.id}`, Severity.LOW);
            graphqlRequest(GET_USER_BY_ID, response.locals, { id: user.id }).then((result: any) => {
                authenticationLogger.info('fetched user by id successfully', Severity.LOW);
                response.locals.user = {
                    ...user,
                    userType: result.data.userById?.userType,
                    investigationGroup: result.data.userById?.investigationGroup,
                    countyByInvestigationGroup: {
                        districtId: result.data.userById?.countyByInvestigationGroup?.districtId
                    }
                };
                return next();
            }).catch(err => {
                authenticationLogger.error(`error in requesting the graphql API due to ${err}`, Severity.HIGH);
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
