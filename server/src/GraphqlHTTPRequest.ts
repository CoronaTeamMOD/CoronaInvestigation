import { DocumentNode } from 'graphql';

import { httpRequest } from './HTTPRequest';

export const graphqlURL = '/coronai/graphql';
export const baseUrl = 'http://localhost:';

export const graphqlRequest = (query: DocumentNode, variables?: any) => (
    httpRequest(baseUrl+process.env.PORT+graphqlURL, 'POST', {query: query.loc?.source.body, variables: { ...variables}})
);