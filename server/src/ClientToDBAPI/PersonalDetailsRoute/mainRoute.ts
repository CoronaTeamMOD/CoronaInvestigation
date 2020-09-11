
import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO, UPDATE_ADRESS, CREATE_ADRESS } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.get('/occupations', (request: Request, response: Response) => {
    graphqlRequest(GET_OCCUPATIONS).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/hmos', (request: Request, response: Response) => {
    graphqlRequest(GET_HMOS).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/investigatedPatientPersonalInfoFields', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, {id: +request.query.epidemioligyNumber}).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, {parentOccupation: request.query.parentOccupation}).then((result: any) => response.send(result));
});
personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, {city: request.query.city}).then((result: any) => response.send(result));
});

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    graphqlRequest(CREATE_ADRESS, {
        city: request.body.personalInfoData.address.city,
        street: request.body.personalInfoData.address.street,
        floor: +request.body.personalInfoData.address.floor,
        houseNum: +request.body.personalInfoData.address.houseNum
    }).then((result: any) => {
        graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, 
            {
                id: request.body.id, 
                hmo: request.body.personalInfoData.insuranceCompany,
                otherOccupationExtraInfo: request.body.personalInfoData.otherOccupationExtraInfo,
                occupation: request.body.personalInfoData.relevantOccupation,
                patientContactPhoneNumber: request.body.personalInfoData.contactPhoneNumber,
                subOccupation: request.body.personalInfoData.institutionName ? request.body.personalInfoData.institutionName : null,
                address: result.data.createAddress.address.id,
            }
        ).then((result: any) => graphqlRequest(UPDATE_PERSON_PERSONAL_INFO,
                {
                    id: result.data.updateInvestigatedPatientById.personByPersonId.id,
                    phoneNumber: request.body.personalInfoData.phoneNumber,
                    additionalPhoneNumber: request.body.personalInfoData.additionalPhoneNumber
                }).then((result: any) => response.send(result)));
    });
});

export default personalDetailsRoute;