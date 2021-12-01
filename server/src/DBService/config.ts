import { Pool } from 'pg';
import PgPubsub from '@graphile/pg-pubsub';
import { makePluginHook, PostGraphileOptions } from 'postgraphile';

require('dotenv').config();

const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const PgOrderByRelatedPlugin = require('@graphile-contrib/pg-order-by-related');
const pluginHook = makePluginHook([PgPubsub]);

const genericOptions: PostGraphileOptions = {
    watchPg: true,
    graphiql: process.env.ENVIRONMENT !== 'prod',
    enhanceGraphiql: true,
    enableCors: true,
    appendPlugins: [ConnectionFilterPlugin, pluginHook, PgOrderByRelatedPlugin],
    graphileBuildOptions: {
        connectionFilterRelations: true
    },
    retryOnInitFail: true,
    bodySizeLimit: '5MB',
    ignoreRBAC: false,
    disableQueryLog: process.env.ENVIRONMENT === 'prod',
    pgSettings: {
        statement_timeout: '30000'
    }
};

const pgPool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: +process.env.MAX_POOL_CONNECTIONS
});

const DBConnectionsObject = {
    coronai: {
        connection: pgPool,
        scheme: [process.env.SCHEMA]
    }
};

module.exports = {
    genericOptions,
    DBConnectionsObject,
};
