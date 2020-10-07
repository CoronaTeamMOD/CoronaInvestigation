import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {SAVE_LIST_OF_CONTACTS, UPDATE_LIST_OF_CONTACTS} from '../../DBService/ContactedPeople/Mutation';
import {
    GET_ALL_FAMILY_RELATIONSHIPS,
    GET_AMOUNT_OF_CONTACTED_PEOPLE,
    GET_CONTACTED_PEOPLE,
    GET_FOREIGN_KEYS_BY_NAMES
} from '../../DBService/ContactedPeople/Query';
import InteractedContact from "../../Models/ContactedPerson/ContactedPerson";

const ContactedPeopleRoute = Router();

ContactedPeopleRoute.get('/familyRelationships', (request: Request, response: Response) =>
    graphqlRequest(GET_ALL_FAMILY_RELATIONSHIPS, response.locals).then((result: any) => response.send(result))
);

ContactedPeopleRoute.get('/amountOfContacts/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_AMOUNT_OF_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch contacted people amount'}))
);

ContactedPeopleRoute.get('/allContacts/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch contacted people'}))
);

ContactedPeopleRoute.post('/interactedContacts', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, { unSavedContacts: JSON.stringify(request.body)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save all the contacts'}))
});

ContactedPeopleRoute.post('/excel', async (request: Request, response: Response) => {
    const {contactEvent, contacts} = request.body;
    const getIdFromResult = (result: any) => result?.nodes.length > 0 ? parseInt(result.nodes[0].id) : null;
    const parsedContactsPromises = contacts.map(async (contactedPerson: InteractedContact) => {
        const parsingVariables = {
            city: contactedPerson.contactedPersonCity,
            contactType: contactedPerson.contactType,
            familyRelationship: contactedPerson.familyRelationship,
        };

        try {
            const parsedForeignKeys = await graphqlRequest(GET_FOREIGN_KEYS_BY_NAMES, response.locals, parsingVariables)
            console.log('parsedForeignKeys data', parsedForeignKeys.data);

            const {allCities, allContactTypes, allFamilyRelationships} = parsedForeignKeys.data;
            const contactedPersonCity = getIdFromResult(allCities),
                contactType = getIdFromResult(allContactTypes),
                familyRelationship = getIdFromResult(allFamilyRelationships);
            console.log('contactedPerson', contactedPerson);

            return {
                ...contactedPerson,
                contactEvent,
                contactedPersonCity,
                contactType,
                familyRelationship,
            };
        } catch (e) {
            console.error(e);
            return {
                ...contactedPerson,
                contactEvent,
                contactedPersonCity: null,
                contactType: null,
                familyRelationship: null,
            }
        }

    });

    const parsedContacts = await Promise.all(parsedContactsPromises);
    console.log('parsedContacts', parsedContacts);
    const mutationVariables = {
        unSavedContacts: JSON.stringify(parsedContacts),
    };

    // return response.json({error:false});

    return graphqlRequest(UPDATE_LIST_OF_CONTACTS, response.locals, mutationVariables)
        .then((result: any) => response.json({error:false}))
        .catch(error => {
            console.error(error);
            return response.status(500).json({error: 'failed to save all the contacts'})
        })
});

export default ContactedPeopleRoute;
