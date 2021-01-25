import { NextFunction, Request, Response } from 'express';

import UserType from '../Models/User/UserType';
import { GET_USER_BY_ID } from '../DBService/Users/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../Logger/Logger';
import { errorStatusCode, graphqlRequest, unauthorizedStatusCode } from '../GraphqlHTTPRequest';

const handleUsersRequest = async (request: Request, response: Response, next: NextFunction) => {
    const { user } = response.locals;
    console.log(user);
    graphqlRequest(GET_USER_BY_ID, response.locals, {id :String(request.body.userId)})
            .then((result: any) => {
                console.log(result.data.userById.countyByInvestigationGroup);
            })
    const investigationMiddlewareLogger = logger.setup({
        workflow: 'InvestigationMiddleware',
        investigation: user.epidemiologynumber,
    });

    if(user.userType === UserType.SUPER_ADMIN) {
        return next();
    } else if(user.userType === UserType.ADMIN) {
        return next();
    } else {
        return response.sendStatus(401);
    }

};

export default handleUsersRequest;