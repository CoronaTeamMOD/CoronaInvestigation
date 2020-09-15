import { Pool } from 'pg';
import PgPubsub from '@graphile/pg-pubsub';
import { makePluginHook, PostGraphileOptions } from 'postgraphile';

require('dotenv').config();

const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const pluginHook = makePluginHook([PgPubsub]);

const genericOptions: PostGraphileOptions = {
    watchPg: true,
    graphiql: process.env.ENVIRONMENT !== 'prod',
    enhanceGraphiql: true,
    enableCors: true,
    appendPlugins: [ConnectionFilterPlugin, pluginHook],
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

let connection = {};

if (process.env.ENVIRONMENT === 'preprod' || process.env.ENVIRONMENT === 'prod') {
    connection = {
        database: process.env.DB_NAME,
        user: process.env.USER,
        host: process.env.HOST,
        ssl: {
            key: process.env.KEY,
            cert: process.env.CERT,
            rejectUnauthorized: false
        }
    };
} else {
    connection = {
        connectionString: process.env.CONNECTION_STRING
    };
}

const pgPool = new Pool({
    ...connection,
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
