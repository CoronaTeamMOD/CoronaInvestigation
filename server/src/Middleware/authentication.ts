import msal from '@azure/msal-node';
import {NextFunction, Request, Response} from 'express';

const clientConfig = {
    auth: {
        clientId: "clientId",
        authority: 'authority'
    }
};

const pca = new msal.PublicClientApplication(clientConfig);

const authMiddleware = (request:Request, response:Response, next: NextFunction) => {
    // const reqAuthHeader = 'authoritybvqYugWrxhIe9r4OXd82I84ZEQR91SHlvrpOL2/ApXb8RPM4aXLDA3HpBa/mhIMURD89Yh0Et73ZpdhIZqkQUlvJeeB35VoWRla90ImnL6PUAYV6BmO/JPR7PUvGRPnqhTifBdHGYVV12Lp24ChPPtH2N9C18JnFlYJa/eKjkALWpJT9XEwoMqP21J98/OxmX8WGxQmxRngzCCCyA+cjjV8o419pH7QahpH9dLDN+ZgsWsvRpeFB0cL3iOC2Nw/N7Zi+FYlLFzezqt3J8VQkKN++tV4Ri5RU75VAEoldOCIeTFkuDy6r8m8WLXgk4H9v3G0aC9ieZc0dWIgeJ47nF42+mBHFI2O+N250qFLgEHm+5vubE2ZbnAKzn0PzgOTAzUvRqVN2hfnNLlCExI3zpYYNOi2w6c1mOOqD4VCTI+5d6/ZqoFBQ7aa8ppTnqF/aC9yp8NXeEppKo1OcpM904fAguI1tpXpoptHjLaxXIGjZnrgPI3sF3K6wkevPgsK05lso2q3hstDTWRrvRb4ug8j51Kapx9xcFpWv3yJwgc9Jmndr5XItEGjox9pWcl1FZbAu1nm1ibcVE3CHJq6Nts8JczY0ORh/Fkr5KO77UY3i1bttURCMTt7OixmDkFh751q96Lj7faPM9wHNU1mBDxoDDpVHEQTLUfMkJEnNrgCm+ty7wV78lSl1fLwds0pd/7N9ejMXK9nKZXcLxiIqzR+j7L+pkiAx88p6ruhQaiGLSR+XNSdVLxkLaXxfOLVhm63/+xcOXGNKtgyXfpt6K9+trYrJXT2cNZOYs4Zt6Bw7W+GKfwpEzNvS+33XgdIYSd/AQ5nhh2yW2zYxVf2tVt/FwDRCtmWU3h+N0YiOqwDrNVbPTB6tVTkG8FU9RcZsSS4mdlCPeIzTyUnCLR3bhnHANbyrMvmuOUtFkEJoc6maLS3tEpWatB9stiSHXyn6DBYH8eP1cF96QvsUC7giLDQLC/i7D9RsJ/7zVtXulv5+6Z/AqCe0qzHlbumtufCZx6v/kWSBQwIcp3h8UPXRnacCGof2pQUGuexwdO7c1b0LCQwh2DS+nR1vSEVLqw7UMHSEFcjenmPP8yYENxjsVeXgIpefT2LJQIaksVklJE87Fk4ZRdJTR8kY0b6hbRvcPb/mGyaIqqhM9d4NuqevxA==';
    // const reqAuthHeader = request.headers.authorization;

    // TODO
    // verify token
    // if(!token)
    //   return response.status(401).json({error: 'unauthorized'});
    // if(!isVerified)
    //   return response.status(403).json({error: 'unauthorized'});
    //
    // // claims ?
    // const userId = request.header("X-MS-CLIENT-PRINCIPAL-ID");
    // const username = request.header('x-ms-client-principal-name');
    //
    // if(!userId)
    //     return response.status(401).json({error: 'unauthorized'}); // other code?
    //
    // // set user
    // const user = {id: userId, username};
    // response.locals.user = user;

    next();
    // const a = {
    //     // redirectUri: '',
    //     scopes: ['']
    // };
    // pca.getAuthCodeUrl(a);

    // const b = {
    //     code: reqAuthHeader, //  from client
    //     // code: request.query.code.toString(), // from getAuthCodeUrl
    //     scopes: [''],
    //     redirectUri: ''
    // };

    // return pca.acquireTokenByCode(b)
    //     .then(console.log)
    //     .then(authResponse => {
    //
    //         //
    //         // if(authResponse.expiresOn > new Date()) {
    //         //     throw Error();
    //         // }
    //         // @ts-ignore
    //         response.user = authResponse.account;
    //
    //         next();
    //     })
    //     .catch(() => response.status(403).json({error:'forbidden'}));
};

export default authMiddleware;