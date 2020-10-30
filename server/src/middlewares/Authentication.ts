import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
import UserType from '../Models/User/UserType';
import { Service, Severity } from '../Models/Logger/types';

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

    if (!userUpn) {
        logger.error({
            service: Service.SERVER,
            severity: Severity.MEDIUM,
            workflow: 'Authentication',
            step: 'got no user at all'
        })
        return response.status(401).json({ error: "unauthorized prod user" });
    }

        const userId =  userUpn.split('@')[0];

        logger.info({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Authentication',
            step: `authorized azure upn successfully! got user: ${JSON.stringify(userId)}`
        });

        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Authentication',
            step: `request to the graphql API with parameters: ${userId}`,
            user: userId,
            investigation: +request.headers.epidemiologynumber
        });

        graphqlRequest(GET_USER_BY_ID, response.locals, { id: userId }).then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Authentication',
                step: 'fetched user by id successfully',
                user: userId,
                investigation: +request.headers.epidemiologynumber
            });
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
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Authentication',
                step: `error in requesting the graphql API: ${err}`,
                user: userId,
            });
            response.sendStatus(500);
        });;
}

const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    response.locals.epidemiologynumber = request.headers.epidemiologynumber;
    if (process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'prod') {
        logger.info({
            service: Service.SERVER,
            workflow: 'Authentication',
            step: 'authenticating with the azure recived upn',
            severity: Severity.LOW
        });
        return handleConfidentialAuth(request, response, next);
    } else {
        logger.info({
            service: Service.SERVER,
            workflow: 'Authentication',
            step: 'authenticating with the stubuser recived upn',
            severity: Severity.LOW
        });
        const token = request.headers.authorization;
        const user = stubUsers[token as keyof typeof stubUsers];
        if (!user) {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Authentication',
                step: `fake user doesn't exist got the upn: ${token}`
            })
            return response.status(401).json({ error: "unauthorized noauth user" });
        } else {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Authentication',
                step: `noauth user found successfully, the user is: ${JSON.stringify(user)}`
            });

            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Authentication',
                step: `request to the graphql API with parameters: ${user.id}`,
                user: user.id,
                investigation: +request.headers.epidemiologynumber
            });
            graphqlRequest(GET_USER_BY_ID, response.locals, { id: user.id }).then((result: any) => {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Authentication',
                    step: 'fetched user by id successfully',
                    user: user.id,
                    investigation: +request.headers.epidemiologynumber
                });
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
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Authentication',
                    step: 'error in requesting the graphql API due to ' + err,
                    user: user.id,
                });
            });;

        }
    }
};

export const adminMiddleWare = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (response.locals.user.userType === UserType.ADMIN ||
        response.locals.user.userType === UserType.SUPER_ADMIN) {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Admin validation',
            step: 'the requested user is admin',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        return next();
    } else {
        logger.error({
            service: Service.SERVER,
            severity: Severity.MEDIUM,
            workflow: 'Admin validation',
            step: 'the user is not admin!',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.status(401).json({ error: "unauthorized non admin user" })
    }
};

export const superAdminMiddleWare = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (response.locals.user.userType === UserType.SUPER_ADMIN) {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Super admin validation',
            step: 'the requested user is super admin',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        return next();
    } else {
        logger.error({
            service: Service.SERVER,
            severity: Severity.MEDIUM,
            workflow: 'Super admin validation',
            step: 'the user is not super admin!',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.status(401).json({ error: "unauthorized non super admin user" })
    }
};
export default authMiddleware;
