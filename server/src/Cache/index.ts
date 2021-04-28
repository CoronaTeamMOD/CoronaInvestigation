import NodeCache from 'node-cache';

const STANDARD_TTL = 3600;

const cache = new NodeCache({
    stdTTL: STANDARD_TTL
});

export default cache;