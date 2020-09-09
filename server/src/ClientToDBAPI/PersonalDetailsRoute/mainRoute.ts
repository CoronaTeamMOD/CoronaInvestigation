
import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO, UPDATE_ADRESS } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_ID_CITY_STREET_BY_EPIDEMIOLOGY_NUMBER } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.get('/getAllOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_OCCUPATIONS).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/getAllHmos', (request: Request, response: Response) => {
    graphqlRequest(GET_HMOS).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/getInvestigatedPatientFieldsIds', (request: Request, response: Response) => {
    graphqlRequest(GET_HMOS).then((result: any) => response.send(result));
});

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
        {
            id: request.body.id, 
            hmo: request.body.personalInfoData.insuranceCompany,
            otherOccupationExtraInfo: request.body.personalInfoData.institutionName,
            occupation: request.body.personalInfoData.relevantOccupation,
            patientContactPhoneNumber: request.body.personalInfoData.contactPhoneNumber
        }
    ).then(() => graphqlRequest(UPDATE_PERSON_PERSONAL_INFO,
            {
                id: 10,
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