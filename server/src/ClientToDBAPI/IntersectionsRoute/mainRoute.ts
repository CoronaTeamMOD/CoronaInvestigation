import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import ContactType from '../../Models/ContactEvent/Enums/ContactType';
import { GET_LOACTIONS_SUB_TYPES_BY_TYPES } from '../../DBService/ContactEvent/Query';
import { EDIT_CONTACT_EVENT, CREATE_CONTACT_EVENT } from '../../DBService/ContactEvent/Mutation';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, request.headers)
    .then((result: GetPlaceSubTypesByTypesResposne) => {
        const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
        result.data.allPlaceTypes.nodes.forEach(type =>
            locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
        );
        response.send(locationsSubTypesByTypes);
    });
});

const convertEventToDBType = (event: any) => {
    event.allowsHamagenData = false;
    event.contacts.forEach((contact: any) => {
        contact.doesNeedIsolation = contact.contactType === ContactType.TIGHT;
        delete contact.contactType
    })

    return event;
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    // graphqlRequest(CREATE_CONTACT_EVENT, convertEventToDBType(request.body))
    // .then((result: any) => {
    //     response.send(result);
    // });
    response.send('done');
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    // graphqlRequest(EDIT_CONTACT_EVENT, convertEventToDBType(request.body))
    // .then((result: any) => {
    //     response.send(result);
    // });
    response.send('done');
});

export default intersectionsRoute;