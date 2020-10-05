
import { Router, Request, Response } from 'express';

import Address from '../../Models/Address';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { CREATE_ADDRESS } from '../../DBService/Address/Mutation';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_PERSON_PERSONAL_INFO } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();
const errorStatusCode = 500;

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
});

personalDetailsRoute.get('/occupations', (request: Request, response: Response) => {
    graphqlRequest(GET_OCCUPATIONS, response.locals).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/hmos', (request: Request, response: Response) => {
    graphqlRequest(GET_HMOS, response.locals).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/investigatedPatientPersonalInfoFields', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, {id: +request.query.epidemioligyNumber}).then((result: any) => response.send(result));
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, {parentOccupation: request.query.parentOccupation}).then((result: any) => response.send(result));
});
personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, {city: request.query.city}).then((result: any) => response.send(result));
});

const savePersonalDetails = (request: Request, response: Response, address?: number, ) => {
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, response.locals,
        {
            id: request.body.id, 
            hmo: request.body.personalInfoData.insuranceCompany,
            otherOccupationExtraInfo: request.body.personalInfoData.otherOccupationExtraInfo
            ? request.body.personalInfoData.otherOccupationExtraInfo : null,
            occupation: request.body.personalInfoData.relevantOccupation,
            patientContactPhoneNumber: request.body.personalInfoData.contactPhoneNumber,
            patientContactInfo: request.body.personalInfoData.contactInfo ? request.body.personalInfoData.contactInfo : null,
            subOccupation: request.body.personalInfoData.institutionName ? request.body.personalInfoData.institutionName : null,
            address,
        }
    ).then((result: any) => {
        graphqlRequest(UPDATE_PERSON_PERSONAL_INFO,  response.locals,
            {
                id: result.data.updateInvestigatedPatientById.personByPersonId.id,
                phoneNumber: request.body.personalInfoData.phoneNumber,
                additionalPhoneNumber: request.body.personalInfoData.additionalPhoneNumber
            }).then((result: any) => response.send(result)).catch(err => response.status(errorStatusCode).send(err));
        }).catch(err => response.status(errorStatusCode).send(err));
}
personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    const address = request.body.personalInfoData.address;
    const requestAddress: Address = {
        cityValue: address.city ? address.city : null ,
        streetValue: address?.street ? address.street : null,
        floorValue: address?.floor ? address?.floor : null,
        houseNumValue: address?.houseNum ? address?.houseNum : null,
    }
    graphqlRequest(CREATE_ADDRESS,  response.locals, { input: requestAddress})
    .then((result) => savePersonalDetails(request, response, result.data.insertAndGetAddressId.integer))
    .catch(err => {
        response.status(errorStatusCode).send(err);
    });
});

export default personalDetailsRoute;