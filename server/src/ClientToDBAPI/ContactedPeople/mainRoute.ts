import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { SAVE_LIST_OF_CONTACTS } from '../../DBService/ContactedPeople/Mutation';
import { GET_ALL_FAMILY_RELATIONSHIPS, GET_AMOUNT_OF_CONTACTED_PEOPLE, GET_CONTACTED_PEOPLE } from '../../DBService/ContactedPeople/Query';

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
    graphqlRequest(SAVE_LIST_OF_CONTACTS, response.locals, { unSavedContacts: JSON.stringify(request.body)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save all the contacts'}))
});

export default ContactedPeopleRoute;
