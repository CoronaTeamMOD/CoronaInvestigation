import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { UPDATE_LIST_OF_CONTACTS } from '../../DBService/ContactedPeople/Mutation';
import { errorStatusCode, graphqlRequest, validStatusCode } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import {
    GET_ALL_CONTACT_STATUSES,
    GET_ALL_FAMILY_RELATIONSHIPS,
    GET_AMOUNT_OF_CONTACTED_PEOPLE,
    GET_CONTACTED_PEOPLE,
    GET_FOREIGN_KEYS_BY_NAMES
} from '../../DBService/ContactedPeople/Query';
import InteractedContact from '../../Models/ContactedPerson/ContactedPerson';
import { sendSavedInvestigationToIntegration } from '../../Utils/InterfacesIntegration';

const DONE_CONTACT = 5;

const ContactedPeopleRoute = Router();

ContactedPeopleRoute.get('/familyRelationships', (request: Request, response: Response) => {
    const familyRelationshipsLogger = logger.setup({
        workflow: 'query all family relationships',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    familyRelationshipsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_FAMILY_RELATIONSHIPS, response.locals).then((result: any) => {
        familyRelationshipsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allFamilyRelationships.nodes);
    }).catch(error => {
        familyRelationshipsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

ContactedPeopleRoute.get('/contactStatuses', (request: Request, response: Response) => {
    const contactStatusesLogger = logger.setup({
        workflow: 'query all contact statuses',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    contactStatusesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_CONTACT_STATUSES, response.locals).then((result: any) => {
        contactStatusesLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allContactStatuses.nodes);
    }).catch(error => {
        contactStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

ContactedPeopleRoute.get('/amountOfContacts/:investigationId', (request: Request, response: Response) => {
    const contactsAmountLogger = logger.setup({
        workflow: 'query investigation amount of contacts',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });

    const parameters = {investigationId: parseInt(request.params.investigationId)};
    contactsAmountLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_AMOUNT_OF_CONTACTED_PEOPLE, response.locals, parameters)
        .then(result => {
            contactsAmountLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            contactsAmountLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
}
);

ContactedPeopleRoute.get('/allContacts/:investigationId', (request: Request, response: Response) => {
    const allContactsLogger = logger.setup({
        workflow: `query all investigation's contacts`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const parameters = { investigationId: parseInt(request.params.investigationId) }
    allContactsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, parameters)
        .then(result => {
            allContactsLogger.info(validDBResponseLog, Severity.LOW);
            const allContactedPersons = result.data.allContactedPeople.nodes;
            const convertedContacts = allContactedPersons.map((contact: InteractedContact) => ({...contact, ...contact.involvementReason}));
            response.send(convertedContacts);
        })
        .catch(error => {
            allContactsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

ContactedPeopleRoute.post('/interactedContacts',  (request: Request, response: Response) => {
    const requestData = request.body;

    const epidemiologyNumber = +response.locals.epidemiologynumber;
    const isThereDoneContact = requestData.unSavedContacts.contacts.some((contact : InteractedContact) => contact.contactStatus === DONE_CONTACT);
    const isSingleContact = requestData.unSavedContacts?.contacts.length === 1;

    const workflow = `Saving ${isSingleContact ? 'single': 'all'} contact${isSingleContact ? '' : 's'}`;

    const interactedContactsLogger = logger.setup({
        workflow,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });

    const parameters = { unSavedContacts: JSON.stringify(request.body)};
    interactedContactsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, parameters)
        .then(result => {
            if (result?.errors) {
                interactedContactsLogger.error(invalidDBResponseLog(result?.errors), Severity.HIGH);
                return response.sendStatus
            }
            interactedContactsLogger.info(validDBResponseLog, Severity.LOW);
            isThereDoneContact && sendSavedInvestigationToIntegration(epidemiologyNumber, workflow, response.locals.user.id);
            response.send(result);
        })
        .catch(error => {
            interactedContactsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

ContactedPeopleRoute.post('/excel', async (request: Request, response: Response) => {
    const excelLogger = logger.setup({
        workflow: `saving contacts execl`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const {contactEvent, contacts} = request.body;
    excelLogger.info('starting excel parsing', Severity.LOW);
    const getIdFromResult = (result: any) => result?.nodes.length > 0 ? parseInt(result.nodes[0].id) : null;
    const parsedContactsPromises = contacts.map(async (contactedPerson: InteractedContact) => {
        const parsingVariables = {
            city: contactedPerson.contactedPersonCity || '',
            contactType: contactedPerson.contactType || '',
            familyRelationship: contactedPerson.familyRelationship || '',
            contactStatus: contactedPerson.contactStatus || ''
        };

        try {
            excelLogger.info(`GET_FOREIGN_KEYS_BY_NAMES: ${launchingDBRequestLog(parsingVariables)}`, Severity.LOW);
            const parsedForeignKeys = await graphqlRequest(GET_FOREIGN_KEYS_BY_NAMES, response.locals, parsingVariables)

            const {allCities, allContactTypes, allFamilyRelationships, allContactStatuses} = parsedForeignKeys.data;
            const contactedPersonCity = getIdFromResult(allCities),
                contactType = getIdFromResult(allContactTypes),
                familyRelationship = getIdFromResult(allFamilyRelationships),
                contactStatus = getIdFromResult(allContactStatuses);

            return {
                ...contactedPerson,
                contactEvent,
                isolationAddress:{city:contactedPersonCity},
                contactType,
                familyRelationship,
                contactStatus
            };
        } catch (e) {
            excelLogger.error(`caught error ${e} from try clause`, Severity.HIGH);
            return {
                ...contactedPerson,
                contactEvent,
                isolationAddress: {city: null},
                contactType: null,
                familyRelationship: null,
                contactStatus: null
            }
        }

    });

    const parsedContacts = await Promise.all(parsedContactsPromises);
    const mutationVariables = {
        unSavedContacts: JSON.stringify(parsedContacts),
    };
    excelLogger.info(`UPDATE_LIST_OF_CONTACTS: ${launchingDBRequestLog(mutationVariables)}`, Severity.LOW);
    return graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, mutationVariables)
        .then(() => {
            excelLogger.info(validDBResponseLog, Severity.LOW);
            response.sendStatus(validStatusCode);
        })
        .catch(error => {
            excelLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        })
});

export default ContactedPeopleRoute;