import cache from '../';
import getCacheNameByUserID from './getCacheNameByUserID';

const getAuthCache = (userId : string) => {
    return cache.get(getCacheNameByUserID(userId));
};

export default getAuthCache;