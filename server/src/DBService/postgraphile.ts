import { postgraphile } from 'postgraphile';

const { genericOptions, DBConnectionsObject } = require('./config');

interface postgraphileError {
    message: string,
    locations: any,
    stack: string
};

const postgraphileServices = Object.keys(DBConnectionsObject).map(key =>
    postgraphile(DBConnectionsObject[key].connection, DBConnectionsObject[key].scheme, {
        ...genericOptions,
        graphqlRoute: `/${key}/graphql`,
        graphiqlRoute: `/${key}/graphiql`,
        websocketMiddlewares: [],
        handleErrors: (errors: postgraphileError[]) => (
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
