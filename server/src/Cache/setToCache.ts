import cache from './';

const setToCache = (url : string, data : any) => {
    cache.set(url , data);
}

export default setToCache;