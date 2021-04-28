import { NextFunction, Request, Response } from 'express';

import cache from '../Cache';
import setToCache from '../Cache/setToCache';

const UseCache = (req : Request, res : Response, next : NextFunction) => {
    const { originalUrl } = req;

    if(cache.has(originalUrl)) {
        const cachedResponse = cache.get(originalUrl);

        return res.send(cachedResponse);
    } else {
        return next();
    }
};

export default UseCache;

export {
    setToCache
};