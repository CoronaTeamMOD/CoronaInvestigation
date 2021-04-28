import cache from '.'

const flushCache = () => {
    cache.flushAll();
}

export default flushCache;