import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GetContactTypeResponse } from '../../Models/ContactEvent/GetContactType';
import { EDIT_CONTACT_EVENT, CREATE_CONTACT_EVENT, DELETE_CONTACT_EVENT } from '../../DBService/ContactEvent/Mutation';
import { GetContactEventResponse, ContactEvent, GetContactEventByIdResponse } from '../../Models/ContactEvent/GetContactEvent';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import { GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, GET_LOACTIONS_SUB_TYPES_BY_TYPES, GET_FULL_CONTACT_EVENT_BY_ID, GET_ALL_CONTACT_TYPES } from '../../DBService/ContactEvent/Query'

const errorStatusCode = 500;

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, response.locals)
        .then((result: GetPlaceSubTypesByTypesResposne) => {
            console.log(result);
            const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
            result.data.allPlaceTypes.nodes.forEach(type =>
                locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
            );
            response.send(locationsSubTypesByTypes);
        }).catch((err) => console.log(err));
});

const convertDBEvent = (event: ContactEvent) => {
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
        contacts,
    };
}

intersectionsRoute.get('/contactTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_ALL_CONTACT_TYPES, response.locals)
        .then((result: GetContactTypeResponse) => {
            response.send(result.data.allContactTypes.nodes);
    }).catch((err) => {
        console.log(err);
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.get('/contactEvent/:investigationId', (request: Request, response: Response) => {
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, response.locals,{ currInvestigation: Number(request.params.investigationId)})
        .then((result: GetContactEventResponse) => {
            console.log(result);
            const allContactEvents: any = result.data.allContactEvents.nodes.map((event: ContactEvent) => convertDBEvent(event));
            response.send(allContactEvents);
    }).catch((err) => {
        console.log(err);
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.get('/contactEventById/:eventId', (request: Request, response: Response) => {
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_ID, response.locals,{ currEventId: Number(request.params.eventId)})
        .then((result: GetContactEventByIdResponse) => {
            console.log(result);
            response.send(convertDBEvent(result.data.contactEventById));
    }).catch((err) => {
        console.log(err);
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

const resetEmptyFields = (object: any) => {
    Object.keys(object).forEach(key => {
        if (object[key] === '') object[key] = null;
    });
}

const convertEventToDBType = (event: any) => {
    const updatedContacts = event.contacts.filter((contact: any) => contact.firstName && contact.lastName && contact.phoneNumber);
    updatedContacts.forEach((contact: any) => {
        contact.id = contact.id ? contact.id : null;
    })
    event.contacts = updatedContacts;
    resetEmptyFields(event);
    (event.locationAddress) && resetEmptyFields(event.locationAddress);
    return event;
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const newEvent = convertEventToDBType(request.body);
    graphqlRequest(CREATE_CONTACT_EVENT, response.locals, {contactEvent: JSON.stringify(newEvent)})
    .then(result => {
        console.log(result);
        response.send(result);
        })
    .catch(err => {
        console.log(err);
        response.status(errorStatusCode).send('error in creating event: ' + err);
    });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    const updatedEvent = convertEventToDBType(request.body);
    graphqlRequest(EDIT_CONTACT_EVENT, response.locals, {event: JSON.stringify(updatedEvent)})
    .then(result => {
        console.log(result);
        response.send(result);
    })
    .catch(err => {
        console.log(err);
        response.status(errorStatusCode).send('error in updating event: ' + err);
    });
});

intersectionsRoute.delete('/deleteContactEvent', (request: Request, response: Response) => {
    const contactEventId = +request.query.contactEventId;
    graphqlRequest(DELETE_CONTACT_EVENT, response.locals, {contactEventId})
    .then(result => {
        console.log(result);
        response.send(result);
    })
    .catch(err => {
        console.log(err);
        response.status(errorStatusCode).send('error in deleting event: ' + err);
    });
});

export default intersectionsRoute;