import { Router, Request, Response } from 'express';

import Contact from '../../Models/ContactEvent/Contact';
import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';import { GetContactTypeResponse } from '../../Models/ContactEvent/GetContactType';
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Places And SubTypes By Types',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, response.locals)
        .then((result: GetPlaceSubTypesByTypesResposne) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Places And SubTypes By Types',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            const locationsSubTypesByTypes : PlacesSubTypesByTypes = {};
            result.data.allPlaceTypes.nodes.forEach(type =>
                locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
            );
            response.send(locationsSubTypesByTypes);
        }).catch((err) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Places And SubTypes By Types',
                step: `got errors approaching the graphql API ${err}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(err);
        });
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Contact Types',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_ALL_CONTACT_TYPES, response.locals)
        .then((result: GetContactTypeResponse) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Contact Types',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.send(result.data.allContactTypes.nodes);
    }).catch((err) => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting Contact Types',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.get('/contactEvent/:investigationId', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Contact Event By Investigation ID',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, response.locals,{ currInvestigation: Number(request.params.investigationId)})
        .then((result: GetContactEventResponse) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Contact Event By Investigation ID',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            const allContactEvents: any = result.data.allContactEvents.nodes.map((event: ContactEvent) => convertDBEvent(event));
            response.send(allContactEvents);
    }).catch((err) => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting Contact Event By Investigation ID',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.get('/contactEventById/:eventId', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Contact Event By Event ID',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_ID, response.locals,{ currEventId: Number(request.params.eventId)})
        .then((result: GetContactEventByIdResponse) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Contact Event By Event ID',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.send(convertDBEvent(result.data.contactEventById));
    }).catch((err) => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting Contact Event By Event ID',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

const resetEmptyFields = (object: any) => {
    Object.keys(object).forEach(key => {
        if (object[key] === '') object[key] = null;
    });
}

const convertEventToDBType = (event: any) => {
    const deletedContacts : number[] = [];
    const updatedContacts = event.contacts?.filter((contact: Contact) => { 
        if (contact.firstName && contact.lastName) {
            return true;
        } else {
            contact.serialId && deletedContacts.push(+contact.serialId);
            return false;
        }
    });
    updatedContacts?.forEach((contact: Contact) => {
        contact.id = contact.id ? contact.id : null;
    })
    event.contacts = updatedContacts;
    resetEmptyFields(event);
    (event.locationAddress) && resetEmptyFields(event.locationAddress);
    return {...event, deletedContacts};
}

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const newEvent = convertEventToDBType(request.body);
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Create Contact Event',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(CREATE_CONTACT_EVENT, response.locals, {contactEvent: JSON.stringify(newEvent)})
    .then(result => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Create Contact Event',
            step: 'got response from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.send(result);
        })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Create Contact Event',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in creating event: ' + err);
    });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    const updatedEvent = convertEventToDBType(request.body);
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Update Contact Event',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(EDIT_CONTACT_EVENT, response.locals, {event: JSON.stringify(updatedEvent)})
    .then(result => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Update Contact Event',
            step: 'got response from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.send(result);
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Update Contact Event',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in updating event: ' + err);
    });
});

intersectionsRoute.delete('/deleteContactEvent', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Delete Contact Event',
        step: `launcing DB request`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const contactEventId = +request.query.contactEventId;
    graphqlRequest(DELETE_CONTACT_EVENT, response.locals, {contactEventId})
    .then(result => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Delete Contact Event',
            step: 'got response from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.send(result);
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Delete Contact Event',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send('error in deleting event: ' + err);
    });
});

export default intersectionsRoute;