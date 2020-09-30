// @ts-ignore
import jwt_decode from 'jwt-decode';
import {NextFunction, Request, Response} from 'express';

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
    if (!token) return response.status(401).json({error: "unauthorized prod user"});

    const decoded = jwt_decode(token);
    const user = {
        id: (decoded[process.env.CLIENT_ID_FIELD] as string).split('@')[0],
        name: decoded.name,
    };

    if(!user || !user.name || !user.id)
        return response.status(403).json({error: "forbidden prod user"});

    response.locals.user = user;
    response.locals.epidemiologynumber = request.headers.epidemiologynumber;
    return next();
}

const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'prod') {
        return handleConfidentialAuth(request, response, next);
    } else {
        const token = request.headers.authorization;
        const user = stubUsers[token as keyof typeof stubUsers];
        if (!user)
            return response.status(401).json({error: "unauthorized noauth user"});
        else {
            console.log(user)
            console.log(request.headers.epidemiologynumber)
            response.locals.user = user;
            response.locals.epidemiologynumber = request.headers.epidemiologynumber;
            return next();
        }
    }
};

export const adminMiddleWare = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    graphqlRequest(GET_USER_BY_ID, response.locals, { id: response.locals.user.id })
        .then((result: any) => {
            if (result.data.userById.isAdmin) {
                return next();
            } else {
                response.status(401).json({error: "unauthorized non admin user" })
            }
        });
};

export default authMiddleware;
