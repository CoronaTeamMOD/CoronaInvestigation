import {Request, Response, Router} from 'express';

import logger from '../../Logger/Logger';
import {graphqlRequest} from '../../GraphqlHTTPRequest';
import { Severity } from '../../Models/Logger/types';
import {GetContactTypeResponse} from '../../Models/ContactEvent/GetContactType';
import {
    GetPlaceSubTypesByTypesResposne,
    PlacesSubTypesByTypes
} from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import {
    GetContactEventResponse,
    ContactEvent} from '../../Models/ContactEvent/GetContactEvent';
import {
    GetInvolvedContactsResponse,
    InvolvedContactDB} from '../../Models/ContactEvent/GetInvolvedContacts';
import {
    CREATE_CONTACT_EVENT,
    DELETE_CONTACT_EVENT,
    DELETE_CONTACT_EVENTS_BY_DATE,
    DELETE_CONTACTED_PERSON,
    EDIT_CONTACT_EVENT
} from '../../DBService/ContactEvent/Mutation';
import {
    GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID,
    GET_LOACTIONS_SUB_TYPES_BY_TYPES,
    GET_ALL_CONTACT_TYPES,
    GET_ALL_INVOLVED_CONTACTS
} from '../../DBService/ContactEvent/Query';

const errorStatusCode = 500;
const duplicatesErrorMsg = 'found duplicate ids';
const intersectionsRoute = Router();

export const handleDBErrors = (response: Response, errorMsg: string, workflow: string) => {
    const handleDBErrorsLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    if(errorMsg.includes(duplicatesErrorMsg)) {
        handleDBErrorsLogger.info('found duplicate ids', Severity.LOW);
    } else {
        handleDBErrorsLogger.error(`got errors approaching the graphql API ${errorMsg}`, Severity.HIGH);
    }
    response.send(errorMsg);
}

intersectionsRoute.get('/', (request: Request, response: Response) => {
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    const getPlacesSubTypesByTypesLogger = logger.setup({
        workflow: 'Getting Places And SubTypes By Types',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    getPlacesSubTypesByTypesLogger.info('Getting Places And SubTypes By Types', Severity.LOW);
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, response.locals)
        .then((result: GetPlaceSubTypesByTypesResposne) => {
            getPlacesSubTypesByTypesLogger.info('got response from DB', Severity.LOW);
            const locationsSubTypesByTypes: PlacesSubTypesByTypes = {};
            result.data.allPlaceTypes.nodes.forEach(type =>
                locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
            );
            response.send(locationsSubTypesByTypes);
        }).catch((err) => {
            getPlacesSubTypesByTypesLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
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
            idNumber: personByPersonInfo.identificationNumber,
        };
    });
    return {
        ...eventObjectToClient,
        contacts,
    };
}

intersectionsRoute.get('/contactTypes', (request: Request, response: Response) => {
    const contactTypesLogger = logger.setup({
        workflow: 'Getting Contact Types',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    contactTypesLogger.info('launcing DB request', Severity.LOW);
    graphqlRequest(GET_ALL_CONTACT_TYPES, response.locals)
        .then((result: GetContactTypeResponse) => {
            contactTypesLogger.info('got response from DB', Severity.LOW);
            response.send(result.data.allContactTypes.nodes);
        }).catch((err) => {
            contactTypesLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.get('/contactEvent/:investigationId', (request: Request, response: Response) => {
    const contactEventLogger = logger.setup({
        workflow: 'Getting Contact Event By Investigation ID',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    contactEventLogger.info('launcing DB request', Severity.LOW);
    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, response.locals, {currInvestigation: Number(request.params.investigationId)})
        .then((result: GetContactEventResponse) => {
            contactEventLogger.info('got response from DB', Severity.LOW);
            const allContactEvents: any = result.data.allContactEvents.nodes.map((event: ContactEvent) => convertDBEvent(event));
            response.send(allContactEvents);
        }).catch((err) => {
            contactEventLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send('error in fetching data: ' + err);
    });
});

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const newEvent = {
        ...request.body,
    }
    const workflow = 'Create Contact Event';
    const createContactEventLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    createContactEventLogger.info('launcing DB request', Severity.LOW);
    graphqlRequest(CREATE_CONTACT_EVENT, response.locals, {contactEvent: JSON.stringify(newEvent)})
        .then(result => {
            if (result?.data?.updateContactEventFunction) {
                createContactEventLogger.info('got response from DB', Severity.LOW);
                response.send(result)
            } else if(result.errors) {
                handleDBErrors(response, result.errors[0].message, workflow)
            }
        })
        .catch(err => {
            createContactEventLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(`error in creating event: ${err}`);
        });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {
    const updatedEvent = {
        ...request.body,
    }
    const workflow = 'Update Contact Event';
    const updateContactEventLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    updateContactEventLogger.info('launcing DB request', Severity.LOW);
    graphqlRequest(EDIT_CONTACT_EVENT, response.locals, {event: JSON.stringify(updatedEvent)})
        .then(result => {
            if(result?.data?.updateContactEventFunction) {
                updateContactEventLogger.info('got response from DB', Severity.LOW);
                response.send(result);
            } else if(result.errors) {
                handleDBErrors(response, result.errors[0].message, workflow)
            }
        })
        .catch(err => {
            updateContactEventLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(`error in updating event: ${err}`);
        });
});

intersectionsRoute.delete('/deleteContactEvent', (request: Request, response: Response) => {
    const deleteContactEventLogger = logger.setup({
        workflow: 'Delete Contact Event',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    deleteContactEventLogger.info('launcing DB request', Severity.LOW);
    const contactEventId = +request.query.contactEventId;
    graphqlRequest(DELETE_CONTACT_EVENT, response.locals, {contactEventId})
        .then(result => {
            deleteContactEventLogger.info('got response from DB', Severity.LOW);
            response.send(result);
        })
        .catch(err => {
            deleteContactEventLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(`error in deleting event: ${err}`);
        });
});

intersectionsRoute.delete('/contactedPerson', (request: Request, response: Response) => {
    const contactedPersonLogger = logger.setup({
        workflow: 'Delete Contacted Person',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    contactedPersonLogger.info('launcing DB request', Severity.LOW);
    const contactedPersonId = +request.query.contactedPersonId;
    graphqlRequest(DELETE_CONTACTED_PERSON, response.locals, {contactedPersonId})
        .then(result => {
            contactedPersonLogger.info('got response from DB', Severity.LOW);
            response.send(result);
        })
        .catch(err => {
            contactedPersonLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send('error in deleting event: ' + err);
        });
});

const convertInvolvedContact = (contact: InvolvedContactDB) => ({
    isContactedPerson: contact.isContactedPerson,
    involvementReason: contact.involvementReason,
    ...contact.familyRelationshipByFamilyRelationship,
    ...contact.cityByIsolationCity,
    ...contact.personByPersonId,
});

intersectionsRoute.get('/involvedContacts/:investigationId', (request: Request, response: Response) => {
    const involvedContacts = logger.setup({
        workflow: 'Getting involved contacts By Investigation ID',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    involvedContacts.info('launcing DB request', Severity.LOW);
    graphqlRequest(GET_ALL_INVOLVED_CONTACTS, response.locals, {currInvestigation: Number(request.params.investigationId)})
        .then((result: GetInvolvedContactsResponse) => {
            if (result?.data?.allInvolvedContacts?.nodes) {
                involvedContacts.info('got response from DB', Severity.LOW);
                const allContactEvents: any = result.data.allInvolvedContacts.nodes.map((contact: InvolvedContactDB) => convertInvolvedContact(contact));
                response.send(allContactEvents);
            } else {
                const message = result?.errors[0]?.message;
                involvedContacts.error(`got errors approaching the graphql API ${message}`, Severity.HIGH);
                response.status(errorStatusCode).send(`error in fetching data: ${message}`);
            }
        }).catch((err) => {
            involvedContacts.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(`error in fetching data: ${err}`);
    });
});

intersectionsRoute.post('/deleteContactEventsByDate', (request: Request, response: Response) => {
    const dateToDeleteBy = request.body.earliestDate;
    const deleteEventsByDateLogger = logger.setup({
        workflow: `Deleting Contact Events earlier than ${dateToDeleteBy}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    deleteEventsByDateLogger.info('Launching GraphQl request to delete contact events', Severity.LOW);
    graphqlRequest(DELETE_CONTACT_EVENTS_BY_DATE, response.locals, {investigationId: Number(response.locals.epidemiologynumber),
        earliestDate: dateToDeleteBy}).then((result) => {
            if(result?.data?.deleteContactEventsBeforeDate) {
                deleteEventsByDateLogger.info('Finished deleting contact events with success', Severity.LOW);
                response.send(result);
            } else if(result?.errors) {
                deleteEventsByDateLogger.info(`Finished deleting contact events with Error ${result?.errors[0]}`, Severity.HIGH);
                response.send(result?.errors[0]);
            }
    }).catch(err => {
        deleteEventsByDateLogger.error(`Server encountered an error while deleting contact events: ${err}`, Severity.HIGH);
        response.status(errorStatusCode).send(err);
    });
});

export default intersectionsRoute;