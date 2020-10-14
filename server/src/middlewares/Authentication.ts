// @ts-ignore
import jwt_decode from 'jwt-decode';
import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
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
    const token = request.headers.authorization;
    if (!token) {
        logger.error({
            service: Service.SERVER,
            severity: Severity.MEDIUM,
            workflow: 'Authentication',
            step: 'got no token at all'
        })
        return response.status(401).json({ error: "unauthorized prod user" });
    }

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Authentication',
        step: 'decoding the azure recived JWT token'
    });
    try {
        const decoded = jwt_decode(token);
        const user = {
            id: (decoded[process.env.CLIENT_ID_FIELD] as string).split('@')[0],
            name: decoded.name,
        };

        if (!user || !user.name || !user.id) {
            logger.warning({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Authentication',
                step: 'got unauthorized token'
            })
            return response.status(403).json({ error: "forbidden prod user" });
        }

        logger.info({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Authentication',
            step: `authorized azure token successfully! got user: ${JSON.stringify(user)}`
        });

        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Authentication',
            step: `request to the graphql API with parameters: ${user.id}`,
            user: response.locals.user.id,
            investigation: +request.headers.epidemiologynumber
        });

        graphqlRequest(GET_USER_BY_ID, response.locals, { id: user.id }).then((result: any) => {
            response.locals.user = {
                ...user,
                ...result.data.userById
            };
            response.locals.epidemiologynumber = request.headers.epidemiologynumber;
            return next();
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Authentication',
                step: 'error in requesting the graphql API',
                user: user.id,
            });
        });;

    } catch (error) {
        logger.error({
            service: Service.SERVER,
            severity: Severity.CRITICAL,
            workflow: 'Authentication',
            step: `error in decoding the recived token: ${token}`
        });
        return response.status(403).json({ error: 'unauthenticated user token' });
    }
}

const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'prod') {
        logger.info({
            service: Service.SERVER,
            workflow: 'Authentication',
            step: 'authenticating with the azure recived JWT token',
            severity: Severity.LOW
        });
        return handleConfidentialAuth(request, response, next);
    } else {
        logger.info({
            service: Service.SERVER,
            workflow: 'Authentication',
            step: 'authenticating with the stubuser recived token',
            severity: Severity.LOW
        });
        const token = request.headers.authorization;
        const user = stubUsers[token as keyof typeof stubUsers];
        if (!user) {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Authentication',
                step: `fake user doesn't exist got the token: ${token}`
            })
            return response.status(401).json({ error: "unauthorized noauth user" });
        } else {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Authentication',
                step: `noauth user found successfully, the user is: ${JSON.stringify(user)}`
            })
            graphqlRequest(GET_USER_BY_ID, response.locals, { id: user.id }).then((result: any) => {
                response.locals.user = {
                    ...user,
                    ...result.data.userById
                };
                response.locals.epidemiologynumber = request.headers.epidemiologynumber;
                return next();
            }).catch(err => {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Authentication',
                    step: 'error in requesting the graphql API',
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
    if (response.locals.user.isAdmin) {
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

export default authMiddleware;
