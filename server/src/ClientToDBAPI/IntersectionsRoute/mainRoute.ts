import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_LOACTIONS_SUB_TYPES_BY_TYPES } from '../../DBService/ContactEvent/Query';
import { GetLocationSubTypesByTypesResposne, LocationsSubTypesByTypes } from '../../Models/ContactEvent/GetLocationSubTypesByTypes';

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getLocationsSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES)
    .then((result: GetLocationSubTypesByTypesResposne) => {
        const locationsSubTypesByTypes : LocationsSubTypesByTypes = {};
        result.data.allPlaceTypes.nodes.map(type => 
            locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes.map(subType => subType.displayName)
        )
        response.send(locationsSubTypesByTypes);
    });
})

export default intersectionsRoute;