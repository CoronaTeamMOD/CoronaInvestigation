import msal from '@azure/msal-node';
import {NextFunction, Request, Response} from 'express';

const clientConfig = {
    auth: {
        clientId: "TBA",
        authority: "TBA",
        // single tenant like -> authority: 'https://login.microsoftonline.com/{your_tenant_id}'
    }
};

const pca = new msal.PublicClientApplication(clientConfig);

const authMiddleware = (request:Request, response:Response, next: NextFunction) => {
    const reqAuthHeader = request.headers.authorization;

    if(!reqAuthHeader)
        return response.status(401).json({error: 'unauthorized'});

    // const a = {
    //     // redirectUri: '',
    //     scopes: ['']
    // };
    // pca.getAuthCodeUrl(a);

    const b = {
        code: reqAuthHeader, //  from client
        // code: request.query.code.toString(), // from getAuthCodeUrl
        scopes: [''],
        redirectUri: ''
    };

    return pca.acquireTokenByCode(b)
        .then(authResponse => {
            console.log(authResponse.idTokenClaims);

            if(authResponse.expiresOn > new Date()) {
                throw Error();
            }
            // @ts-ignore
            response.user = authResponse.user;

            next();
        })
        .catch(() => response.status(403).json({error:'forbidden'}));
};

export default authMiddleware;