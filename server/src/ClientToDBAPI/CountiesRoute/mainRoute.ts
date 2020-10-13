import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { adminMiddleWare } from '../../middlewares/Authentication';
import {GET_COUNTY_DISPLAY_NAME_BY_USER} from '../../DBService/Counties/Query';

const countiesRoute = Router();

countiesRoute.get('/county/displayName', adminMiddleWare, (request: Request, response: Response) => {
    graphqlRequest(GET_COUNTY_DISPLAY_NAME_BY_USER, response.locals, { id: +response.locals.user.group })
        .then((result: any) => {
            return response.send(result.data);
        });
});

export default countiesRoute;
