import { DocumentNode } from 'graphql';

import { UPDATE_LAST_UPDATE_TIME } from '../src/ClientToDBAPI/Query/query';
import { httpRequest } from './HTTPRequest';

export const graphqlURL = '/coronai/graphql';
export const baseUrl = 'http://localhost:';

export const graphqlRequest = (query: DocumentNode, variables?: any) => (
    httpRequest(baseUrl+process.env.PORT+graphqlURL, 'POST', {query: query.loc?.source.body, variables: { ...variables}})
    // .then(() => httpRequest(
    //     baseUrl+process.env.PORT+graphqlURL, 'POST', {
    //         query: (UPDATE_LAST_UPDATE_TIME as DocumentNode).loc?.source.body, 
    //         variables: {
    //             epidemiologyNumber: 111,
    //             lastUpdateTime: new Date()
    //         }
    //     }
    // ))
);