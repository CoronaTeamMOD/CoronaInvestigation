import { postgraphile, makePluginHook } from 'postgraphile';
const { dafault: pgPubsub } = require('@graphile/pg-pubsub');

const { genericOptions, DBConnectionsObject } = require('./config');

interface IError {
    message: any,
    locations: any,
    stack: any
}

const pluginHook = makePluginHook([pgPubsub]);

const postgraphileServices = Object.keys(DBConnectionsObject).map(key =>
    postgraphile(DBConnectionsObject[key].connection, DBConnectionsObject[key].scheme, {
        pluginHook,
        ...genericOptions,
        graphqlRoute: `/${key}/graphql`,
        graphiqlRoute: `/${key}/graphiql`,
        websocketMiddlewares: [],
        handleErrors: (errors: IError[]) => (
            errors.map(error => (
                {
                    message: error.message,
                    locations: error.locations,
                    stack: error.stack
                }
            ))
        )
    })
);

export default postgraphileServices;
