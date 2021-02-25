import {Request, Response, Router} from 'express';

import { Severity } from '../../Models/Logger/types';
import {errorStatusCode, validStatusCode, graphqlRequest} from '../../GraphqlHTTPRequest';
import {GetContactTypeResponse} from '../../Models/ContactEvent/GetContactType';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import {GetContactEventResponse, ContactEvent, ClientInteractionsData} from '../../Models/ContactEvent/GetContactEvent';
import { GetInvolvedContactsResponse, InvolvedContactDB} from '../../Models/ContactEvent/GetInvolvedContacts';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { GetPlaceSubTypesByTypesResposne, PlacesSubTypesByTypes } from '../../Models/ContactEvent/GetPlacesSubTypesByTypes';
import {
    CREATE_OR_EDIT_CONTACT_EVENT, DELETE_CONTACT_EVENT, 
    DELETE_CONTACT_EVENTS_BY_DATE, DELETE_CONTACTED_PERSON, 
    CREATE_CONTACTED_PERSON, DUPLICATE_PERSON, 
    ADD_CONTACTS_FROM_BANK
} from '../../DBService/ContactEvent/Mutation';
import {
    GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID, 
    GET_LOACTIONS_SUB_TYPES_BY_TYPES, GET_ALL_CONTACT_TYPES,
    GET_ALL_INVOLVED_CONTACTS, CONTACTS_BY_GROUP_ID, 
    CONTACTS_BY_CONTACTS_IDS
} from '../../DBService/ContactEvent/Query';

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

intersectionsRoute.get('/contactEvent/:minimalDateToFilter', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const contactEventLogger = logger.setup({
        workflow: `query investigation's contact events`,
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = {currInvestigation: epidemiologyNumber, minimalDateToFilter: new Date(request.params.minimalDateToFilter)};
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

const extractInteractions = (interactionsData: ClientInteractionsData) => {
    const {additionalOccurrences, ...data} = interactionsData;
    const {startTime, endTime, unknownTime, placeDescription, externalizationApproval, ...commonData} = data;
    const baseData = [data];
    return additionalOccurrences?.length > 0
        ? baseData.concat(additionalOccurrences.map(occurence => ({...commonData, ...occurence})))
        : baseData
};

intersectionsRoute.post('/createContactEvent', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const createContactEventLogger = logger.setup({
        workflow: 'create contact event',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });
    const parameters = {
        event: JSON.stringify({
            contactEvents: extractInteractions(request.body),
            investigationId: epidemiologyNumber
        })
    };
    createContactEventLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(CREATE_OR_EDIT_CONTACT_EVENT, response.locals, parameters)
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
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const updateContactEventLogger = logger.setup({
        workflow: 'update contact event',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });

    const parameters = {event: JSON.stringify({
        contactEvents: [request.body],
        investigationId : epidemiologyNumber
    })};

    updateContactEventLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(CREATE_OR_EDIT_CONTACT_EVENT, response.locals, parameters)
        .then(result => {
            updateContactEventLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            updateContactEventLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

intersectionsRoute.post('/groupedInvestigationContacts' , async (request : Request, response: Response) => {
    const {epidemiologynumber} = response.locals;
    const {eventId , contacts} = request.body;
    
    const createGroupedContactLogger = logger.setup({
        workflow: 'add grouped investigations contacts',
        user: response.locals.user.id,
        investigation: epidemiologynumber
    });

    let fullContacts = await graphqlRequest(CONTACTS_BY_CONTACTS_IDS , response.locals ,{ids : contacts})
        .then(result => {
            createGroupedContactLogger.info(validDBResponseLog, Severity.LOW);
            return result.data.allContactedPeople.edges
        })
        .catch(error => {
            createGroupedContactLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });

    fullContacts = await Promise.all(fullContacts.map(async (contact : any) => {
        const newPersonInfo = await graphqlRequest(DUPLICATE_PERSON , response.locals ,{personId : parseInt(contact.node.personInfo)})
            .then(result => {
                return result.data.duplicatePersonById.bigInt
            })
            .catch(error => {
                createGroupedContactLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.status(errorStatusCode).send(error);
            });
        return {
                ...contact.node,
                personInfo : parseInt(newPersonInfo),
                contactStatus: 1,
                contactEvent: eventId,
                creationTime: new Date()
        }
    }));

    await fullContacts.map(async (contact : any) => {
        await graphqlRequest(CREATE_CONTACTED_PERSON , response.locals , {params : contact})
            .then(result => {
                createGroupedContactLogger.info(validDBResponseLog, Severity.LOW);
                return;
            })
            .catch(error => {
                createGroupedContactLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.status(errorStatusCode).send(error);
                return;
            })
            
    });
    response.sendStatus(validStatusCode);
});

intersectionsRoute.delete('/deleteContactEvent', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const deleteContactEventLogger = logger.setup({
        workflow: 'delete contact event',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });
    const queryVariables = {
        contactEventId: parseInt(request.query.contactEventId as string),
        investigationId: epidemiologyNumber
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

intersectionsRoute.delete('/contactedPerson', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const contactedPersonLogger = logger.setup({
        workflow: 'delete contacted person',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });
    const queryVariables = {
        contactedPersonId: parseInt(request.query.contactedPersonId as string),
        involvedContactId: request.query.involvedContactId ? parseInt(request.query.involvedContactId as string) : null,
        investigationId: epidemiologyNumber,
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
    return {
        id: contact.id,
        isContactedPerson: contact.isContactedPerson,
        involvementReason: contact.involvementReason,
        educationClassNumber: contact.educationClassNumber,
        familyRelationship: contact.familyRelationship,
        isolationAddress: contact.address,
        ...contact.educationGrade,
        ...contact.personByPersonId,
        ...contact.subOccupationByInstitutionName,
    }
};

intersectionsRoute.get('/involvedContacts', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const involvedContacts = logger.setup({
        workflow: `query investigation's involved contacts`,
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = {currInvestigation: epidemiologyNumber};
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

intersectionsRoute.get('/groupedInvestigationsContacts/:groupId', (request: Request, response : Response) => {
    const epidemiologynumber = parseInt(response.locals.epidemiologynumber);
    const { groupId } = request.params;
    const groupedInvestigationsContacts = logger.setup({
        workflow: `query groupInvestiagions contacts`,
        user: response.locals.user.id,
        investigation: epidemiologynumber
    });

    const parameters = {epidemiologynumber , groupId }
    graphqlRequest(CONTACTS_BY_GROUP_ID, response.locals, parameters)
        .then((result) => {
            groupedInvestigationsContacts.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.investigationGroupById);
        }).catch(error => {
            groupedInvestigationsContacts.error(invalidDBResponseLog(error), Severity.HIGH);
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

intersectionsRoute.post('/addContactsFromBank', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const addContactsFromBankLogger = logger.setup({
        workflow: 'add contacts to event from contacts bank',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = {
        contactEventId: request.body.contactEventId,
        contacts: JSON.stringify({contacts: request.body.contacts})
    };

    addContactsFromBankLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(ADD_CONTACTS_FROM_BANK, response.locals, parameters)
        .then(result => {
            addContactsFromBankLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            addContactsFromBankLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

export default intersectionsRoute;