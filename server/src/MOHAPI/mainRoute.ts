import { Router, Request, Response } from 'express';
import {PublicClientApplication} from "@azure/msal-node";
import axios from 'axios';
import {IncomingHttpHeaders} from "http";
const mohRouter = Router();

// const clientConfig = {
//     auth: {
//         clientId: "clientId",
//         authority: 'authority'
//     }
// };
const validateToken = (baseUrl: string, access_token: string) => {
    const loginroute = '/.auth/login/aad';
    return axios.post(baseUrl + loginroute, {access_token})
        .catch(console.log);
};

const getClaimsFromReq = (request:Request) => {
    const claimRoute = '/.auth/me';
    const headers  = {cookies : request.cookies}; // TBD?
    return axios.get(request.baseUrl + claimRoute, {headers})
        // .then(console.log)
     //   .catch(console.log);
};

const getClaimsFromHeaders = (request: Request) => {
    const id = request.header("X-MS-CLIENT-PRINCIPAL-ID");
    const username = request.header('x-ms-client-principal-name');
    return {id, username}
};

mohRouter.get('/', async (request:Request, response:Response) => {
    // verify token
    const token = request.cookies[0] || request.headers.authorization[0];

    if(!token)
        return response.status(401).json({error: 'unauthorized'});

    const authenticatedToken = await validateToken(request.baseUrl, token);
    console.log(authenticatedToken);

    if(!authenticatedToken)  // check what you could do with it ?
        return response.status(403).json({error: 'unauthorized'});

    // claims ?
    const user = getClaimsFromHeaders(request);
    // OR
   const claims = getClaimsFromReq(request).then(claims => console.log(claims)); // see what can be extracted

    if(!user.id)
        return response.status(401).json({error: 'unauthorized'}); // TODO other code?

    // set user
    response.locals.user = user;
    console.log(user);
    // next();
});

// mohRouter.get('/', (request: Request, response: Response) => {
//     response.send('Hello from MOH Api');
// })

export default mohRouter;