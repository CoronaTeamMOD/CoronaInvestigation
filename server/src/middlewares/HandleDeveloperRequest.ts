import { NextFunction, Request, Response } from "express";

import { unauthorizedStatusCode } from '../GraphqlHTTPRequest';

const HandleDeveloperRequest = (req : Request, res : Response, next : NextFunction) => {
    const currentUser = res.locals.user;
    const { isDeveloper } = currentUser;

    return isDeveloper 
        ? next()
        : res.sendStatus(unauthorizedStatusCode)
}


export default HandleDeveloperRequest;