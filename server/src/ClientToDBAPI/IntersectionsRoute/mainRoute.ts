import {Request, Response, Router} from 'express';

import { Severity } from '../../Models/Logger/types';
import {errorStatusCode, graphqlRequest} from '../../GraphqlHTTPRequest';
import {
    GetPlaceSubTypesByTypesResposne,
    PlacesSubTypesByTypes
} from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import {GetContactTypeResponse} from '../../Models/ContactEvent/GetContactType';
import {
    GetContactEventResponse,
    ContactEvent
} from '../../Models/ContactEvent/GetContactEvent';
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
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import Address from '../../Models/Address/Address';

const intersectionsRoute = Router();
        
intersectionsRoute.get('/', (request: Request, response: Response) => {
    response.send(request.query.epidemioligyNumber);
})

const createPlacesSubTypesByTypes = (result: GetPlaceSubTypesByTypesResposne) => {
    const locationsSubTypesByTypes: PlacesSubTypesByTypes = {};
    result.data.allPlaceTypes.nodes.forEach(type =>
        locationsSubTypesByTypes[type.displayName] = type.placeSubTypesByParentPlaceType.nodes
    );
    return locationsSubTypesByTypes;
}

intersectionsRoute.get('/getPlacesSubTypesByTypes', (request: Request, response: Response) => {
    const getPlacesSubTypesByTypesLogger = logger.setup({
        workflow: 'query places sub types by types',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    getPlacesSubTypesByTypesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_LOACTIONS_SUB_TYPES_BY_TYPES, response.locals)
        .then((result: GetPlaceSubTypesByTypesResposne) => {
            getPlacesSubTypesByTypesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(createPlacesSubTypesByTypes(result));
        }).catch(error => {
            getPlacesSubTypesByTypesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
    });
});

intersectionsRoute.get('/contactTypes', (request: Request, response: Response) => {
    const contactTypesLogger = logger.setup({
        workflow: 'query all contact types',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    contactTypesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_CONTACT_TYPES, response.locals)
        .then((result: GetContactTypeResponse) => {
            contactTypesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allContactTypes.nodes);
        }).catch((error) => {
            contactTypesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
    });
});

const convertDBEvent = (event: ContactEvent) => {
    const {contactedPeopleByContactEvent, ...eventObjectToClient} = event;
    const contacts: any = contactedPeopleByContactEvent.nodes.map((person) => {
        const {personByPersonInfo, involvedContact ,...personNoData} = person;
        let convertedInvolvedContact = null;
        if (involvedContact) {
            convertedInvolvedContact = convertInvolvedContact(involvedContact);
        }
        return {
            ...personNoData,
            ...personByPersonInfo,
            involvedContact: convertedInvolvedContact,
        };
    });
    return {
        ...eventObjectToClient,
        contacts,
    };
}

intersectionsRoute.get('/contactEvent/:investigationId', (request: Request, response: Response) => {
    const contactEventLogger = logger.setup({
        workflow: `query investigation's contact events`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {currInvestigation: Number(request.params.investigationId)};
    contactEventLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, response.locals, parameters)
        .then((result: GetContactEventResponse) => {
            contactEventLogger.info(validDBResponseLog, Severity.LOW);
            const allContactEvents: any = result.data.allContactEvents.nodes.map((event: ContactEvent) => convertDBEvent(event));
            response.send(allContactEvents);
        }).catch(error => {
            contactEventLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
    });
});

intersectionsRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const createContactEventLogger = logger.setup({
        workflow: 'create contact event',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {contactEvent: JSON.stringify({
        ...request.body,
    })}
    createContactEventLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(CREATE_CONTACT_EVENT, response.locals, parameters)
        .then(result => {
            createContactEventLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            createContactEventLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

intersectionsRoute.post('/updateContactEvent', (request: Request, response: Response) => {

    const updateContactEventLogger = logger.setup({
        workflow: 'update contact event',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {event: JSON.stringify({
        ...request.body,
    })}
    updateContactEventLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(EDIT_CONTACT_EVENT, response.locals, parameters)
        .then(result => {
            updateContactEventLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            updateContactEventLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

intersectionsRoute.delete('/deleteContactEvent', (request: Request, response: Response) => {
    const deleteContactEventLogger = logger.setup({
        workflow: 'delete contact event',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    const queryVariables = {
        contactEventId: parseInt(request.query.contactEventId as string),
        investigationId: parseInt(request.query.investigationId as string)
    };
    deleteContactEventLogger.info(launchingDBRequestLog(queryVariables), Severity.LOW);
    graphqlRequest(DELETE_CONTACT_EVENT, response.locals, queryVariables)
        .then(result => {
            deleteContactEventLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            deleteContactEventLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

intersectionsRoute.delete('/contactedPerson', (request: Request, response: Response) => {
    const contactedPersonLogger = logger.setup({
        workflow: 'delete contacted person',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    const queryVariables = {
        contactedPersonId: parseInt(request.query.contactedPersonId as string),
        involvedContactId: request.query.involvedContactId ? parseInt(request.query.involvedContactId as string) : null,
        investigationId: parseInt(request.query.investigationId as string),
    }
    contactedPersonLogger.info(launchingDBRequestLog(queryVariables), Severity.LOW);
    graphqlRequest(DELETE_CONTACTED_PERSON, response.locals, queryVariables)
        .then(result => {
            contactedPersonLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            contactedPersonLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

const convertInvolvedContact = (contact: InvolvedContactDB) => {
    
    const convertedAddress : Address = {
        city: contact.address.city?.city || null,
        street: contact.address.street?.street || null,
        floor: contact.address.floor,
        houseNum: contact.address.houseNum
    }

    return {
        id: contact.id,
        isContactedPerson: contact.isContactedPerson,
        involvementReason: contact.involvementReason,
        educationClassNumber: contact.educationClassNumber,
        familyRelationship: contact.familyRelationship,
        isolationAddress: convertedAddress,
        ...contact.educationGrade,
        ...contact.personByPersonId,
        ...contact.subOccupationByInstitutionName,
    }
};

intersectionsRoute.get('/involvedContacts/:investigationId', (request: Request, response: Response) => {
    const involvedContacts = logger.setup({
        workflow: `query investigation's involved contacts`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {currInvestigation: Number(request.params.investigationId)};
    involvedContacts.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_ALL_INVOLVED_CONTACTS, response.locals, parameters)
        .then((result: GetInvolvedContactsResponse) => {
            involvedContacts.info(validDBResponseLog, Severity.LOW);
            const allContactEvents = result.data.allInvolvedContacts.nodes.map((contact: InvolvedContactDB) => convertInvolvedContact(contact));
            response.send(allContactEvents);
        }).catch(error => {
            involvedContacts.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
    });
});

intersectionsRoute.delete('/deleteContactEventsByDate', (request: Request, response: Response) => {
    const dateToDeleteBy = request.query.earliestDateToInvestigate;
    const deleteEventsByDateLogger = logger.setup({
        workflow: `delete contact events earlier than ${dateToDeleteBy}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });

    const parameters = {
        investigationId: Number(response.locals.epidemiologynumber),
        earliestDate: dateToDeleteBy
    }
    deleteEventsByDateLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(DELETE_CONTACT_EVENTS_BY_DATE, response.locals, parameters)
    .then((result) => {
        deleteEventsByDateLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        deleteEventsByDateLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

export default intersectionsRoute;