import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { EDIT_CONTACT_EVENT, CREATE_CONTACT_EVENT } from '../../DBService/ContactEvent/Mutation';
import { GetContactEventResponse, ContactEvent } from '../../Models/ContactEvent/GetContactEvent';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import { GET_LOACTIONS_SUB_TYPES_BY_TYPES, GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID } from '../../DBService/ContactEvent/Query';
import {ContactedPerson} from "../../Models/ContactedPerson/ContactedPerson";

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES)
    .then((result: GetPlaceSubTypesByTypesResposne) => {
        const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
        result.data.allPlaceTypes.nodes.map(type => 
            locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes.map(subType => subType.displayName)
        )
        response.send(locationsSubTypesByTypes);
    });
});

intersectionsRoute.post('/getContactEvent', (request: Request, response: Response) => {
    console.log('investigation id: ' + request.body.investigationId);
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, { currInvestigation: request.body.investigationId})
        .then((result: GetContactEventResponse) => {
            let allEventOfInvestigation = {};
            result.data.allContactEvents.nodes.map((event: ContactEvent) => {
                const {contactedPeopleByContactEvent, ...eventObjectToClient} = event;
                const contactedDataToSend = contactedPeopleByContactEvent.nodes;
                let contacts = {};
                contactedDataToSend.map((person) => {
                   const {personByPersonInfo, ...personNoData} = person;
                   const personToSend = {
                       ...personNoData,
                       firstName: personByPersonInfo.firstName,
                       lastName: personByPersonInfo.lastName,
                       phoneNumber: personByPersonInfo.phoneNumber,
                       id: personByPersonInfo.identificationNumber,
                   };
                   contacts = {
                       ...contacts,
                       ...personToSend
                   }
                });
                const eventToSend = {
                    ...eventObjectToClient,
                    contacts: contacts,
                }
                allEventOfInvestigation = {
                    ...allEventOfInvestigation,
                    eventToSend
                }
            });
            response.send({...allEventOfInvestigation});
    });
});

const convertEventToDBType = (event: any) => {
    event.allowsHamagenData = false;
    event.contacts.forEach((contact: any) => {
        contact.doesNeedIsolation = contact.contactType === 'מגע הדוק';
        delete contact.contactType
    })

    return event;
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    graphqlRequest(CREATE_CONTACT_EVENT, convertEventToDBType(request.body))
    .then((result: any) => {
        response.send(result);
    });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    graphqlRequest(EDIT_CONTACT_EVENT, convertEventToDBType(request.body))
    .then((result: any) => {
        response.send(result);
    });
});


export default intersectionsRoute;