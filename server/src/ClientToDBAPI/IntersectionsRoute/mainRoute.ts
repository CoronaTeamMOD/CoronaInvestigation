import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import ContactType from '../../Models/ContactEvent/Enums/ContactType';
import { EDIT_CONTACT_EVENT, CREATE_CONTACT_EVENT } from '../../DBService/ContactEvent/Mutation';
import { GetContactEventResponse, ContactEvent } from '../../Models/ContactEvent/GetContactEvent';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import { GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, GET_LOACTIONS_SUB_TYPES_BY_TYPES } from '../../DBService/ContactEvent/Query'

const errorStatusCode = 500;

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, response.locals)
        .then((result: GetPlaceSubTypesByTypesResposne) => {
            const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
            result.data.allPlaceTypes.nodes.forEach(type =>
                locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
            );
            response.send(locationsSubTypesByTypes);
        });
});

intersectionsRoute.get('/contactEvent/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, response.locals,{ currInvestigation: Number(request.params.investigationId)})
        .then((result: GetContactEventResponse) => {
            const allContactEvents: any = result.data.allContactEvents.nodes.map((event: ContactEvent) => {
                const {contactedPeopleByContactEvent, ...eventObjectToClient} = event;
                const contacts: any = contactedPeopleByContactEvent.nodes.map((person) => {
                   const {personByPersonInfo, ...personNoData} = person;
                   return {
                       ...personNoData,
                       serialId: personNoData.id,
                       firstName: personByPersonInfo.firstName,
                       lastName: personByPersonInfo.lastName,
                       phoneNumber: personByPersonInfo.phoneNumber,
                       id: personByPersonInfo.identificationNumber,
                   };
                });
                return {
                    ...eventObjectToClient,
                    contacts: contacts,
                };
            });
            response.send(allContactEvents);
    }).catch((err) => {
        response.status(errorStatusCode).send('error in fetching data: ' + err)
    });
});

const resetEmptyFields = (object: any) => {
    Object.keys(object).forEach(key => {
        if (object[key] === '') object[key] = null
    });
}

const convertEventToDBType = (event: any) => {
    const updatedContacts = event.contacts.filter((contact: any) => contact.firstName && contact.lastName && contact.phoneNumber);
    updatedContacts.forEach((contact: any) => {
        contact.doesNeedIsolation = contact.contactType === ContactType.TIGHT;
        contact.id = contact.id === '' ? null : contact.id;
        delete contact.contactType;
    })
    event.contacts = updatedContacts;
    resetEmptyFields(event);
    resetEmptyFields(event.locationAddress);
    return event;
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const newEvent = convertEventToDBType(request.body);
    graphqlRequest(CREATE_CONTACT_EVENT, response.locals, {contactEvent: JSON.stringify(newEvent)})
    .then(result => response.send(result))
    .catch(err => {
        console.log(err);
        response.status(errorStatusCode).send('error in fetching data: ' + err)
    });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    const updatedEvent = convertEventToDBType(request.body);
    graphqlRequest(EDIT_CONTACT_EVENT, response.locals, {event: JSON.stringify(updatedEvent)})
    .then(result => {
        response.send(result)
    })
    .catch(err => {
        console.log(err);
        response.status(errorStatusCode).send('error in fetching data: ' + err)
    });
});

export default intersectionsRoute;