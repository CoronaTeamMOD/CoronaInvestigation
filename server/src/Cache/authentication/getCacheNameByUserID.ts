const AUTHENTICATION_PREFIX = '/auth/';

const getCacheNameByUserID = ( userId : string ) => {
    return AUTHENTICATION_PREFIX + userId
};

export default getCacheNameByUserID;