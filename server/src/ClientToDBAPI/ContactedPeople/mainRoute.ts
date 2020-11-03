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

ContactedPeopleRoute.get('/familyRelationships', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting family relationships',
        step: 'launching graphql API request',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    graphqlRequest(GET_ALL_FAMILY_RELATIONSHIPS, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting family relationships',
            step: 'got respond from the DB',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.send(result)
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Getting family relationships',
            step: `got error from the graphql API ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.sendStatus(500);
    });
});

ContactedPeopleRoute.get('/contactStatuses', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting contact statuses',
        step: 'launching graphql API request',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    graphqlRequest(GET_ALL_CONTACT_STATUSES, response.locals).then((result: any) => {
        if (result?.data?.allContactStatuses?.nodes) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting contact statuses',
                step: 'got respond from the DB',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.send(result?.data?.allContactStatuses?.nodes);
        } else {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting contact statuses',
                step: `got error from the graphql API ${result.errors[0].message ? result.errors[0].message : JSON.stringify(result)}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusCode).json({ error: 'failed to fetch contact statuses' });
        }
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Getting contact statuses',
            step: `got error from the graphql API ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.status(errorStatusCode).json({ error: 'failed to fetch contact statuses' });
    });
});

ContactedPeopleRoute.get('/amountOfContacts/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_AMOUNT_OF_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(errorStatusCode).json({error: 'failed to fetch contacted people amount'}))
);

ContactedPeopleRoute.get('/allContacts/:investigationId', (request: Request, response: Response) => {
    const getContactsQueryVariables = { investigationId: parseInt(request.params.investigationId) }
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting contacts',
        step: `launching server request with parameter ${JSON.stringify(getContactsQueryVariables)}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, getContactsQueryVariables)
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting contacts',
                step: 'got respond from the DB',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.send(result)
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting contacts',
                step: `got error from the graphql API ${error}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusCode).json({error: 'failed to fetch contacted people'})
        })
});

ContactedPeopleRoute.post('/interactedContacts', (request: Request, response: Response) => {
    const epidemiologyNumber = +response.locals.epidemiologynumber;
    const isThereDoneContact = request.body.unSavedContacts.contacts.some((contact : InteractedContact) => contact.contactStatus === DONE_CONTACT);
    const isSingleContact = request.body.unSavedContacts?.contacts.length === 1;
    const workflow = `Saving ${isSingleContact ? 'single': 'all'} contact${isSingleContact ? '' : 's'}`;
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: `Saving ${isSingleContact ? 'single': 'all'} contact${isSingleContact ? '' : 's'}`,
        step: `launching graphql API request with parameter: ${JSON.stringify(request.body)}`,
        user: response.locals.user.id,investigation: response.locals.epidemiologynumber
    });
    graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, { unSavedContacts: JSON.stringify(request.body)})
        .then((result: any) => {
            if(result.data.updateContactPersons) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow,
                    step: 'got response from DB',
                    user: response.locals.user.id,investigation: epidemiologyNumber
                });
                isThereDoneContact && sendSavedInvestigationToIntegration(epidemiologyNumber, workflow, response.locals.user.id);
                response.send(result);
            } else if(result.errors) {
                handleDBErrors(response, result.errors[0]);
            }
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow,
                step: `got error from DB from graphql API: ${error}`,
                user: response.locals.user.id,investigation: response.locals.epidemiologynumber
            });
            response.status(errorStatusCode).json({error: 'failed to save all the contacts'});
        })
});

ContactedPeopleRoute.post('/excel', async (request: Request, response: Response) => {
    const {contactEvent, contacts} = request.body;
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: `Saving execl to DB`,
        step: 'Starting excel parsing',
        user: response.locals.user.id,investigation: response.locals.epidemiologynumber
    });
    const getIdFromResult = (result: any) => result?.nodes.length > 0 ? parseInt(result.nodes[0].id) : null;
    const parsedContactsPromises = contacts.map(async (contactedPerson: InteractedContact) => {
        const parsingVariables = {
            city: contactedPerson.contactedPersonCity || '',
            contactType: contactedPerson.contactType || '',
            familyRelationship: contactedPerson.familyRelationship || '',
            contactStatus: contactedPerson.contactStatus || ''
        };

        try {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: `Saving execl to DB (TRY clause)`,
                step: `Launching GraphQL Request GET_FOREIGN_KEYS_BY_NAMES, with variables: ${JSON.stringify(parsingVariables)}`,
                user: response.locals.user.id,investigation: response.locals.epidemiologynumber
            });
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
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: `Saving execl to DB (CATCH clause)`,
                step:  `caught error ${e} from try clause`,
                user: response.locals.user.id,investigation: response.locals.epidemiologynumber
            });
            console.error(e);
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

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: `Saving execl to DB - update contacts graphQL request`,
        step:  `Launching GraphQL Request UPDATE_LIST_OF_CONTACTS, with variables: ${JSON.stringify(mutationVariables)}`,
        user: response.locals.user.id,investigation: response.locals.epidemiologynumber
    });
    return graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, mutationVariables)
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: `Saving execl to DB graphql request result`,
                step:  `Got graphQL result: ${JSON.stringify(result)}`,
                user: response.locals.user.id,investigation: response.locals.epidemiologynumber
            });
            const hasErrors = result?.errors?.length > 0;
            const status = hasErrors ? 500 : 200;
            return response.sendStatus(status);
        })
        .catch(error => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: `Saving execl to DB graphql request catch`,
                step:  `Got graphQL error: ${JSON.stringify(error)}`,
                user: response.locals.user.id,investigation: response.locals.epidemiologynumber
            });
            console.error(error);
            return response.sendStatus(500);
        })
});

export default ContactedPeopleRoute;