import cache from '.'

const AUTHENTICATION_PREFIX = '/auth/';
const AUTH_TTL = 60;

const getCacheByUserID = ( userId : string ) => {
    return AUTHENTICATION_PREFIX + userId
}

const hasAuthCache = ( userId : string ) => {
    return cache.has(getCacheByUserID(userId))
}

const setAuthCache = ( userId : string, data : any ) => {
    cache.set(getCacheByUserID(userId), data , AUTH_TTL)
}

const getAuthCache = (userId : string) => {
    return cache.get(userId);
}

const removeAuthCache = (userId : string) => {
    cache.del(userId)
}
// TODO: seperate?

export {
    hasAuthCache,
    setAuthCache,
    getAuthCache,
    removeAuthCache
}