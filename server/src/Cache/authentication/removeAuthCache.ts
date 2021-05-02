import cache from '../';
import getCacheNameByUserID from './getCacheNameByUserID';

const removeAuthCache = (userId : string) => {
    cache.del(getCacheNameByUserID(userId));
};

export default removeAuthCache;