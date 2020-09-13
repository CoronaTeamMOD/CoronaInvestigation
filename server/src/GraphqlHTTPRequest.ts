import { DocumentNode } from 'graphql';

import { httpRequest } from './HTTPRequest';
import { UPDATE_INVESTIGATION_METADATA } from './DBService/InvestigationMetadata';

export const graphqlURL = '/coronai/graphql';
export const baseUrl = 'http://localhost:';

const updateLastTimeAndUpdator = (requestHeaders: any) =>
    httpRequest(baseUrl+process.env.PORT+graphqlURL, 'POST', {
        query: (UPDATE_INVESTIGATION_METADATA as DocumentNode).loc?.source.body,
        variables: {
            epidemiologyNumber: +requestHeaders.epidemiologynumber,
            lastUpdateTime: new Date(),
            lastUpdator: requestHeaders.user.name
        }
    });



export const graphqlRequest = (query: DocumentNode, requestHeaders: any, variables?: any) => (
    httpRequest(baseUrl+process.env.PORT+graphqlURL, 'POST', {query: query.loc?.source.body, variables: { ...variables}})
    .then((result) => {
        if (requestHeaders) {
            //@ts-ignore
            if (query.definitions[0].operation === 'mutation') {
                updateLastTimeAndUpdator(requestHeaders)
            }
        }
        return result;
    })
);
