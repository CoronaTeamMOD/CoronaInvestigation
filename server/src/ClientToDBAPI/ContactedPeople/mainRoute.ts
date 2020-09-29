import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ContactedPerson } from '../../Models/ContactedPerson/ContactedPerson';
import { UPDATE_CONTACTED_PERSON, SAVE_ALL_CONTACTS} from '../../DBService/ContactedPeople/Mutation';
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

ContactedPeopleRoute.post('/updateContactedPerson', (request: Request, response: Response) => {
    const updatedPersonDetails: ContactedPerson = request.body;
    graphqlRequest(UPDATE_CONTACTED_PERSON, response.locals, {
        currContactedPerson: updatedPersonDetails.id,
        cantReachContact: updatedPersonDetails.cantReachContact,
        cityOfContacted: updatedPersonDetails.contactedPersonCity.displayName,
        currCondition: updatedPersonDetails.doesFeelGood,
        doesLiveWithConfirmed: updatedPersonDetails.doesLiveWithConfirmed,
        doesNeedHelpInIsolation: updatedPersonDetails.doesNeedHelpInIsolation,
        relationShip: updatedPersonDetails.relationship,
        repeatingOccuranceWithConfirmed: updatedPersonDetails.repeatingOccuranceWithConfirmed,
        familyRelationship: updatedPersonDetails.familyRelationship,
        doesWorkWithCrowd: updatedPersonDetails,
        doesHaveBackgroundDiseases: updatedPersonDetails.doesHaveBackgroundDiseases,
        occupation: updatedPersonDetails.occupation,
    })
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save contacted person'}))

});

ContactedPeopleRoute.post('/saveAllContacts', (request: Request, response: Response) =>
    graphqlRequest(SAVE_ALL_CONTACTS, response.locals, { unSavedContacts: request.body})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to save all the contacts'}))
);

export default ContactedPeopleRoute;
