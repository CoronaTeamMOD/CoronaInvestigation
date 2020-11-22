import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { handleDBErrors } from '../IntersectionsRoute/mainRoute'
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Severity, Service } from '../../Models/Logger/types';
import { UPDATE_LIST_OF_CONTACTS } from '../../DBService/ContactedPeople/Mutation';
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
const errorStatusCode = 500;
const validStatusCode = 200;

ContactedPeopleRoute.get('/familyRelationships', (request: Request, response: Response) => {
    const familyRelationshipsLogger = logger.setup({
        workflow: 'Getting family relationships',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    familyRelationshipsLogger.info('launching graphql API request', Severity.LOW);
    graphqlRequest(GET_ALL_FAMILY_RELATIONSHIPS, response.locals).then((result: any) => {
        familyRelationshipsLogger.info('got respond from the DB', Severity.LOW);
        response.send(result)
    }).catch(err => {
        familyRelationshipsLogger.error(`got error from the graphql API ${err}`, Severity.HIGH);
        response.sendStatus(500);
    });
});

ContactedPeopleRoute.get('/contactStatuses', (request: Request, response: Response) => {
    const contactStatusesLogger = logger.setup({
        workflow: 'Getting contact statuses',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    contactStatusesLogger.info('launching graphql API request', Severity.LOW);
    graphqlRequest(GET_ALL_CONTACT_STATUSES, response.locals).then((result: any) => {
        if (result?.data?.allContactStatuses?.nodes) {
            contactStatusesLogger.info('got respond from the DB', Severity.LOW);
            response.send(result?.data?.allContactStatuses?.nodes);
        } else {
            contactStatusesLogger.error(`got error from the graphql API ${result.errors[0].message ? result.errors[0].message : JSON.stringify(result)}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'failed to fetch contact statuses' });
        }
    }).catch(err => {
        contactStatusesLogger.error(`got error from the graphql API ${err}`, Severity.HIGH);
        response.status(errorStatusCode).json({ error: 'failed to fetch contact statuses' });
    });
});

ContactedPeopleRoute.get('/amountOfContacts/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_AMOUNT_OF_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(errorStatusCode).json({error: 'failed to fetch contacted people amount'}))
);

ContactedPeopleRoute.get('/allContacts/:investigationId', (request: Request, response: Response) => {
    const allContactsLogger = logger.setup({
        workflow: 'Getting contacts',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const getContactsQueryVariables = { investigationId: parseInt(request.params.investigationId) }
    allContactsLogger.info(`launching server request with parameter ${JSON.stringify(getContactsQueryVariables)}`, Severity.LOW);
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, getContactsQueryVariables)
        .then((result: any) => {
            allContactsLogger.info('got respond from the DB', Severity.LOW);
            response.send(result)
        })
        .catch(error => {
            allContactsLogger.error(`got error from the graphql API ${error}`, Severity.HIGH);
            response.status(errorStatusCode).json({error: 'failed to fetch contacted people'})
        })
});

ContactedPeopleRoute.post('/interactedContacts', (request: Request, response: Response) => {
    const epidemiologyNumber = +response.locals.epidemiologynumber;
    const isThereDoneContact = request.body.unSavedContacts.contacts.some((contact : InteractedContact) => contact.contactStatus === DONE_CONTACT);
    const isSingleContact = request.body.unSavedContacts?.contacts.length === 1;
    const workflow = `Saving ${isSingleContact ? 'single': 'all'} contact${isSingleContact ? '' : 's'}`;
    const interactedContactsLogger = logger.setup({
        workflow: `Saving ${isSingleContact ? 'single': 'all'} contact${isSingleContact ? '' : 's'}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    interactedContactsLogger.info(`launching graphql API request with parameter: ${JSON.stringify(request.body)}`, Severity.LOW);
    graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, { unSavedContacts: JSON.stringify(request.body)})
        .then((result: any) => {
            if(result.data.updateContactPersons) {
                interactedContactsLogger.info('got response from DB', Severity.LOW);
                isThereDoneContact && sendSavedInvestigationToIntegration(epidemiologyNumber, workflow, response.locals.user.id);
                response.send(result);
            } else if(result.errors) {
                handleDBErrors(response, result.errors[0].message, workflow);
            }
        })
        .catch(error => {
            interactedContactsLogger.error(`got error from DB from graphql API: ${error}`, Severity.HIGH);
            response.status(errorStatusCode).json({error: 'failed to save all the contacts'});
        })
});

ContactedPeopleRoute.post('/excel', async (request: Request, response: Response) => {
    const excelLogger = logger.setup({
        workflow: `Saving execl to DB`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const {contactEvent, contacts} = request.body;
    excelLogger.info('Starting excel parsing', Severity.LOW);
    const getIdFromResult = (result: any) => result?.nodes.length > 0 ? parseInt(result.nodes[0].id) : null;
    const parsedContactsPromises = contacts.map(async (contactedPerson: InteractedContact) => {
        const parsingVariables = {
            city: contactedPerson.contactedPersonCity || '',
            contactType: contactedPerson.contactType || '',
            familyRelationship: contactedPerson.familyRelationship || '',
            contactStatus: contactedPerson.contactStatus || ''
        };

        try {
            excelLogger.info(`Launching GraphQL Request GET_FOREIGN_KEYS_BY_NAMES, with variables: ${JSON.stringify(parsingVariables)}`, Severity.LOW);
            const parsedForeignKeys = await graphqlRequest(GET_FOREIGN_KEYS_BY_NAMES, response.locals, parsingVariables)

            const {allCities, allContactTypes, allFamilyRelationships, allContactStatuses} = parsedForeignKeys.data;
            const contactedPersonCity = getIdFromResult(allCities),
                contactType = getIdFromResult(allContactTypes),
                familyRelationship = getIdFromResult(allFamilyRelationships),
                contactStatus = getIdFromResult(allContactStatuses);

            return {
                ...contactedPerson,
                contactEvent,
                contactedPersonCity,
                contactType,
                familyRelationship,
                contactStatus
            };
        } catch (e) {
            excelLogger.error(`caught error ${e} from try clause`, Severity.HIGH);
            return {
                ...contactedPerson,
                contactEvent,
                contactedPersonCity: null,
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
    excelLogger.info(`Launching GraphQL Request UPDATE_LIST_OF_CONTACTS, with variables: ${JSON.stringify(mutationVariables)}`, Severity.LOW);
    return graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, mutationVariables)
        .then((result: any) => {
            if(result?.data?.updateContactPersons) {
                excelLogger.info(`Got graphQL result: ${JSON.stringify(result)}`, Severity.LOW);
                response.sendStatus(validStatusCode);
            } else if(result.errors) {
                handleDBErrors(response, result.errors[0].message, 'Saving execl to DB');
            }
        })
        .catch(error => {
            excelLogger.error(`Got graphQL error: ${JSON.stringify(error)}`, Severity.HIGH);
            return response.sendStatus(500);
        })
});

export default ContactedPeopleRoute;