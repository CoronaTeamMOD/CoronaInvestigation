import cache from '../';
import getCacheNameByUserID from './getCacheNameByUserID'

const hasAuthCache = ( userId : string ) => {
    return cache.has(getCacheNameByUserID(userId))
}

export default hasAuthCache;