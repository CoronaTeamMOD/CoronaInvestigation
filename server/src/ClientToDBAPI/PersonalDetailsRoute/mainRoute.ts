
import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO, UPDATE_ADRESS } from '../../DBService/PersonalDetails/Mutation';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
        {
            id: request.body.id, 
            hmo: request.body.personalInfoData.insuranceCompany,
            workPlace: request.body.personalInfoData.institutionName,
            occupation: request.body.personalInfoData.relevantOccupation,
        }
    ).then(() => graphqlRequest(UPDATE_PERSON_PERSONAL_INFO,
            {
                id: 96,
                phoneNumber: request.body.personalInfoData.phoneNumber,
                additionalPhoneNumber: request.body.personalInfoData.additionalPhoneNumber
            }).then(() => {
                graphqlRequest(UPDATE_ADRESS,
                {
                    id: 88,
                    city: request.body.personalInfoData.address.city,
                    street: request.body.personalInfoData.address.street,
                    floor: Number(request.body.personalInfoData.address.floor),
                    houseNum: Number(request.body.personalInfoData.address.houseNumber)
                }).then((result: any) => response.send(result));
        }));
});

export default personalDetailsRoute;