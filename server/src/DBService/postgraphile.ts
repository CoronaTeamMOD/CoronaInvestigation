import GraphilePro from '@graphile/pro';
import PgPubsub from '@graphile/pg-pubsub';
import OperationHooks from '@graphile/operation-hooks';
import { postgraphile, makePluginHook } from 'postgraphile';

const { genericOptions, DBConnectionsObject } = require('./config');

interface IError {
    message: any,
    locations: any,
    stack: any
};

const pluginHook = makePluginHook([OperationHooks, PgPubsub, GraphilePro]);

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
