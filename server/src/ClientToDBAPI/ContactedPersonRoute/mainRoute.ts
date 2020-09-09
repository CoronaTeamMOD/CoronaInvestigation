import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import CreatePersonResponse from '../../Models/Person/CreatePersonResponse'
import { CREATE_PERSON, CREATE_CONTACTED_PERSON } from '../../DBService/ContactedPerson/Mutation'

const contactedPersonRoute = Router();

contactedPersonRoute.post('/createContactedPeople', (req: Request, res: Response) => {
    const contactedPersonalData = req.body.personalData;
    const contactRelatedData = req.body.contactData;
    graphqlRequest(CREATE_PERSON, {
        ...contactedPersonalData
    }).then((createPersonResponse: CreatePersonResponse) => {
       graphqlRequest(CREATE_CONTACTED_PERSON, {
           contactedPerson: {
                personalInfo: createPersonResponse.data.insertPersonAndGetId.integer,
                ...contactRelatedData,
           }
       }).then(() => {
           res.send('Created contacted person: ' + createPersonResponse);
       })
    });
})

export default contactedPersonRoute;