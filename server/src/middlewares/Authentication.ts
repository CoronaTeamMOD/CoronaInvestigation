import axios from 'axios';
import {NextFunction, Request, Response} from 'express';

type AuthenticationReturn = [{
    access_token: string;
    expires_on: Date;
    id_token: string;
    provider_name: string;
    refresh_token: string;
    user_claims: [{
        typ: string;
        val: string;
    }];
    user_id: string;
}];

const stubUsers = {
    'fake token!': {
        id: '7',
        name: 'stub_user',
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
    const cookie = request.headers.cookie;
    if (!cookie) return response.status(401).json({error: "unauthorized prod user"});

    const claimRoute = "/.auth/me";
    const headers = {Cookie: cookie};

    return axios
        .get<AuthenticationReturn>(process.env.CLIENT_URL + claimRoute, {headers})
        .then((result) => {
            const {data} = result;
            const user = ({
                id: data[0].user_id,
                name: data[0].user_claims.find(claim => claim.typ === 'name')?.val as string,
            });

            response.locals.user = user;
            response.locals.epidemiologynumber = request.headers.epidemiologynumber;
            return next();
        })
        .catch((e) => {
            console.error('failed to authenticate user with error: ', e);
            return response.status(403).json({error: 'forbidden'});
        });
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
            response.locals.user = user;
            response.locals.epidemiologynumber = request.headers.epidemiologynumber;
            return next();
        }
    }
};

export default authMiddleware;
