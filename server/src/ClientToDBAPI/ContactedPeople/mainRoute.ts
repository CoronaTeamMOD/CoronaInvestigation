import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { SAVE_LIST_OF_CONTACTS } from '../../DBService/ContactedPeople/Mutation';
import { GET_ALL_FAMILY_RELATIONSHIPS, GET_CONTACTED_PEOPLE } from '../../DBService/ContactedPeople/Query';

const ContactedPeopleRoute = Router();

ContactedPeopleRoute.get('/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch contacted people'}))
);

ContactedPeopleRoute.post('/familyRelationships', (request: Request, response: Response) =>
    graphqlRequest(GET_ALL_FAMILY_RELATIONSHIPS, response.locals).then((result: any) => response.send(result))
);

ContactedPeopleRoute.post('/saveAllContacts', (request: Request, response: Response) => {
    graphqlRequest(SAVE_LIST_OF_CONTACTS, response.locals, { unSavedContacts: JSON.stringify(request.body)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save all the contacts'}))
});

export default ContactedPeopleRoute;
