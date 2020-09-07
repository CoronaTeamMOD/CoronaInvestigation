
import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO, UPDATE_ADRESS } from '../../DBService/PersonalDetails/Mutation';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    console.log(request.body);

    // graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
    //     {
    //         id: request.body.id, 
    //         hmo: request.body.personalInfoData.insuranceCompany,
    //         workPlace: request.body.personalInfoData.institutionName,
    //         occupation: request.body.personalInfoData.relevantOccupation,
    //     }
    // );

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
                console.log(request.body.address);
                graphqlRequest(UPDATE_ADRESS,
                {
                    id: 88,
                    city: request.body.personalInfoData.address.city,
                    street: request.body.personalInfoData.address.street,
                    floor: request.body.personalInfoData.address.floor,
                    houseNum: request.body.personalInfoData.address.houseNum
            })}));
});

export default personalDetailsRoute;