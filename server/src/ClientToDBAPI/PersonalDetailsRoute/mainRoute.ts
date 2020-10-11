
import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { CREATE_ADDRESS } from '../../DBService/Address/Mutation';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_COVID_PATIENT_PERSONAL_INFO } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY } from '../../DBService/PersonalDetails/Query';
import GetInvestigatedPatientDetails, { PersonalInfoDbData } from '../../Models/PersonalInfo/GetInvestigatedPatientDetails';

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

const convertPatientDetailsFromDB = (investigatedPatientDetails: PersonalInfoDbData) => {
    const convertedInvestigatedPatientDetails = {
        ...investigatedPatientDetails,
        ...investigatedPatientDetails.covidPatientByCovidPatient
    }
    delete convertedInvestigatedPatientDetails.covidPatientByCovidPatient;

    return convertedInvestigatedPatientDetails;
}

personalDetailsRoute.get('/investigatedPatientPersonalInfoFields', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, {id: +request.query.epidemioligyNumber})
    .then((result: GetInvestigatedPatientDetails) => {
        if (result?.data?.investigationByEpidemiologyNumber?.investigatedPatientByInvestigatedPatientId) {
            const investigatedPatientDetails = result.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
            response.send(convertPatientDetailsFromDB(investigatedPatientDetails));
        } else {
            response.status(errorStatusCode).json({error: 'failed to fetch personal details'});
        }
    });
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, {parentOccupation: request.query.parentOccupation}).then((result: any) => response.send(result));
});
personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, {city: request.query.city}).then((result: any) => response.send(result));
});

const savePersonalDetails = (request: Request, response: Response, address?: number, ) => {
    const { personalInfoData } = request.body;
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, response.locals,
        {
            id: request.body.id, 
            hmo: personalInfoData.insuranceCompany,
            otherOccupationExtraInfo: personalInfoData.otherOccupationExtraInfo || null,
            occupation: personalInfoData.relevantOccupation,
            patientContactPhoneNumber: personalInfoData.contactPhoneNumber,
            patientContactInfo: personalInfoData.contactInfo || null,
            subOccupation: personalInfoData.institutionName || null,
            additionalPhoneNumber: personalInfoData.additionalPhoneNumber,
        }
    ).then((result: any) => {
        graphqlRequest(UPDATE_COVID_PATIENT_PERSONAL_INFO,  response.locals,
            {
                id: result.data.updateInvestigatedPatientById.covidPatientByCovidPatient.epidemiologyNumber,
                primaryPhone: personalInfoData.phoneNumber,
                address,
            }).then((result: any) => response.send(result)).catch(err => response.status(errorStatusCode).send(err));
        }).catch(err => response.status(errorStatusCode).send(err));
}
personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    const address = request.body.personalInfoData.address;
    const requestAddress: InsertAndGetAddressIdInput = {
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