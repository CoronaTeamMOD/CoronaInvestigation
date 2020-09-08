import axios from 'axios';
import {NextFunction, Request, Response} from 'express';

const authMiddleware = (request:Request, response:Response, next: NextFunction) => {
    const token = request.headers.authorization;

    if(!token)
        return response.status(401).json({error: 'unauthorized'});
   
    if (!(process.env.ENVIRONMENT === 'prod')) {
        switch (token) {
            case 'fake token!':
                response.locals.user = {id: '7', name: 'חוקר פיקטיבי'};
                next();
                break;
            default:
                return response.status(403).json({error: 'forrbidden'});
        }
    } else {
        const claimRoute = '/.auth/me';
        console.log('request cookies:', request.cookies);
        const headers = {Cookie: request.cookies};
        axios.get(request.baseUrl + claimRoute, {headers})
            .then(result => {
                const {data} = result;
                console.log('auth/me result', data);
                Array.isArray(data) && console.log(data[0], data[0]?.user_id, data[0]?.user_claims);
            })
            .catch(e => console.error(e));

        next();
    }
};

export default authMiddleware;
