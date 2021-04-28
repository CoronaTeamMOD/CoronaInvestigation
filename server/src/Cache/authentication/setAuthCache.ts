import cache from '../'
import getCacheNameByUserID from './getCacheNameByUserID'

const AUTH_TTL = 60;

const setAuthCache = ( userId : string, data : any ) => {
    cache.set(getCacheNameByUserID(userId), data , AUTH_TTL)
}

export default setAuthCache;