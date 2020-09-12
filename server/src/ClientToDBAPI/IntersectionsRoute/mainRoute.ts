import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import ContactType from '../../Models/ContactEvent/Enums/ContactType';
import { GET_LOACTIONS_SUB_TYPES_BY_TYPES } from '../../DBService/ContactEvent/Query';
import { EDIT_CONTACT_EVENT, CREATE_CONTACT_EVENT } from '../../DBService/ContactEvent/Mutation';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';

const errorStatusCode = 500;

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES)
    .then((result: GetPlaceSubTypesByTypesResposne) => {
        const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
        result.data.allPlaceTypes.nodes.forEach(type =>
            locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
        );
        response.send(locationsSubTypesByTypes);
    });
});

const resetEmptyFields = (object: any) => {
    Object.keys(object).forEach(key => {
        if (object[key] === '') object[key] = null
    });
}

const convertEventToDBType = (event: any) => {
    const updatedContacts = event.contacts.filter((contact: any) => contact.id && contact.firstName && contact.lastName && contact.phoneNumber);
    updatedContacts.forEach((contact: any) => {
        contact.doesNeedIsolation = contact.contactType === ContactType.TIGHT;
        delete contact.contactType;
    })
    event.contacts = updatedContacts;
    resetEmptyFields(event);
    resetEmptyFields(event.locationAddress);
    event.contacted_number = updatedContacts.length;
    event.locationAddress.floor = +event.locationAddress.floor;
    event.locationAddress.apartment = +event.locationAddress.apartment;

    return event;
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const newEvent = convertEventToDBType(request.body);
    graphqlRequest(CREATE_CONTACT_EVENT, {contactEvent: JSON.stringify(newEvent)})
    .then(result => response.send(result))
    .catch(err => response.status(errorStatusCode).send('error in fetching data: ' + err));
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    const updatedEvent = convertEventToDBType(request.body);
    graphqlRequest(EDIT_CONTACT_EVENT, {contactEvent: JSON.stringify(updatedEvent)})
    .then(result => response.send(result))
    .catch(err => response.status(errorStatusCode).send('error in fetching data: ' + err));
});

export default intersectionsRoute;