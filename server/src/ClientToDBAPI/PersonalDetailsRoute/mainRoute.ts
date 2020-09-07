import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO, UPDATE_ADRESS } from '../../DBService/PersonalDetails/Mutation';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    console.log(request);

    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
        {
            id: request.body.id, 
            hmo: request.body.insuranceCompany,
            workPlace: request.body.institutionName,
            occupation: request.body.relevantOccupation,
        }
    );

    // graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
    //     {
    //         id: request.body.id, 
    //         hmo: request.body.insuranceCompany,
    //         workPlace: request.body.institutionName,
    //         occupation: request.body.relevantOccupation,
    //     }
    // ).then(() => graphqlRequest(UPDATE_PERSON_PERSONAL_INFO).then(() => graphqlRequest(UPDATE_ADRESS)));
});

export default personalDetailsRoute;