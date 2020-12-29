
import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Severity } from '../../Models/Logger/types';
import { CREATE_ADDRESS, UPDATE_ADDRESS } from '../../DBService/Address/Mutation';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import { calculateInvestigationComplexity } from '../../Utils/InvestigationComplexity/InvestigationComplexity';
import GetInvestigatedPatientDetails, { PersonalInfoDbData } from '../../Models/PersonalInfo/GetInvestigatedPatientDetails';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_COVID_PATIENT_PERSONAL_INFO } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY, GET_ALL_INVESTIGATED_PATIENT_ROLES } from '../../DBService/PersonalDetails/Query';

const complexityCalculationMessage = 'personal details tab';
const personalDetailsRoute = Router();
const errorStatusCode = 500;

personalDetailsRoute.get('/occupations', (request: Request, response: Response) => {
    const occupationsLogger = logger.setup({
        workflow: 'Fetching Occupations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    occupationsLogger.info('launching DB request', Severity.LOW);
    graphqlRequest(GET_OCCUPATIONS, response.locals).then((result: any) => {
        occupationsLogger.info('got respond from DB', Severity.LOW);
        response.send(result)
    }).catch(error => {
        occupationsLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/hmos', (request: Request, response: Response) => {
    const hmosLogger = logger.setup({
        workflow: 'Fetching HMOs',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    hmosLogger.info('launching DB request', Severity.LOW);
    graphqlRequest(GET_HMOS, response.locals).then((result: any) => {
        hmosLogger.info('got respond from DB', Severity.LOW);
        response.send(result)
    }).catch(error => {
        hmosLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/investigatedPatientRoles', (request: Request, response: Response) => {
    const investigatedPatientRolesLogger = logger.setup({
        workflow: 'Fetching investigated patient roles',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigatedPatientRolesLogger.info('launching DB request', Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATED_PATIENT_ROLES, response.locals).then((result: any) => {
        investigatedPatientRolesLogger.info('got respond from DB', Severity.LOW);
        response.send(result?.data?.allInvestigatedPatientRoles?.nodes);
    }).catch(error => {
        investigatedPatientRolesLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
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
    const investigatedPatientPersonalInfoFieldsLogger = logger.setup({
        workflow: 'Fetching Personal Details',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigatedPatientPersonalInfoFieldsLogger.info('launching DB request', Severity.LOW);
    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, {id: +request.query.epidemioligyNumber})
    .then((result: GetInvestigatedPatientDetails) => {
        if (result?.data?.investigationByEpidemiologyNumber?.investigatedPatientByInvestigatedPatientId) {
            investigatedPatientPersonalInfoFieldsLogger.info('got respond from DB', Severity.LOW);
            const investigatedPatientDetails = result.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
            response.send(convertPatientDetailsFromDB(investigatedPatientDetails));
        } else {
            investigatedPatientPersonalInfoFieldsLogger.warn('got invalid reponse from the DB', Severity.MEDIUM);
            response.status(errorStatusCode).json({error: 'failed to fetch personal details'});
        }
    })
    .catch(error => {
        investigatedPatientPersonalInfoFieldsLogger.error(`got error while accessing the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    const subOccupationsLogger = logger.setup({
        workflow: 'Fetching Sub Occupation by Parent Occupation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    subOccupationsLogger.info(`launcing DB request with parameter ${request.query.parentOccupation}`, Severity.LOW);
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, {parentOccupation: request.query.parentOccupation}).then((result: any) => {
        subOccupationsLogger.info('got respond from DB', Severity.LOW);
        response.send(result)
    }).catch(error => {
        subOccupationsLogger.error(`got error while accessing the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    const educationSubOccupationsLogger = logger.setup({
        workflow: 'Fetching Education Sub Occupation by City',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    educationSubOccupationsLogger.info(`launcing DB request with parameter ${request.query.city}`, Severity.LOW);
    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, {city: request.query.city}).then((result: any) => {
        educationSubOccupationsLogger.info('got respond from DB', Severity.LOW);
        response.send(result)
    }).catch(error => {
        educationSubOccupationsLogger.error(`got error while accessing the graphql API: ${error}`, Severity.HIGH);
        response.sendStatus(errorStatusCode);
    });
});

const savePersonalDetails = (request: Request, response: Response, address?: number, ) => {
    const { personalInfoData } = request.body;
    
    const dbPersonalInfoData = {
        id: request.body.id, 
        hmo: personalInfoData.insuranceCompany,
        otherOccupationExtraInfo: personalInfoData.otherOccupationExtraInfo || null,
        occupation: personalInfoData.relevantOccupation,
        patientContactPhoneNumber: personalInfoData.contactPhoneNumber,
        patientContactInfo: personalInfoData.contactInfo || null,
        subOccupation: personalInfoData.institutionName || null,
        additionalPhoneNumber: personalInfoData.additionalPhoneNumber,
        role: personalInfoData.role,
        educationGrade: personalInfoData.educationGrade,
        educationClassNumber: personalInfoData.educationClassNumber,
    };
    const savePersonalDetailsLogger = logger.setup({
        workflow: 'Saving personal details tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    savePersonalDetailsLogger.info(`launching update personal info with the parameters ${JSON.stringify(dbPersonalInfoData)}`, Severity.LOW);
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, response.locals, dbPersonalInfoData).then((result: any) => {
        const dbCovidPatientPersonalInfo = {
            id: result.data.updateInvestigatedPatientById.covidPatientByCovidPatient.epidemiologyNumber,
            primaryPhone: personalInfoData.phoneNumber,
            address
        }
        savePersonalDetailsLogger.info(`saved personal info now saving covid patient personal info with parameters ${JSON.stringify(dbCovidPatientPersonalInfo)}`, Severity.LOW);
        graphqlRequest(UPDATE_COVID_PATIENT_PERSONAL_INFO,  response.locals, dbCovidPatientPersonalInfo).then((result: any) => {
            savePersonalDetailsLogger.info('saved covid patient personal info', Severity.LOW);
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }).catch(err => {
            savePersonalDetailsLogger.error(`error in requesting graphql API request in UPDATE_COVID_PATIENT_PERSONAL_INFO request due to ${err}`, Severity.HIGH);
            response.status(errorStatusCode).json({message: 'failed to save the personal details covid patient details'});
        });
    })
    .catch(err => {
        savePersonalDetailsLogger.error(`error in requesting graphql API request in UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO request due to ${err}`, Severity.HIGH);
        response.status(errorStatusCode).json({message: 'failed to save the personal details investigated patient details'});
    });
}

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    const addressId = request.body.addressId;
    const address = request.body.personalInfoData.address;
    const updatePersonalDetailsLogger = logger.setup({
        workflow: 'Saving personal details tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    if (address === null || address === undefined) {
        updatePersonalDetailsLogger.info('didnt get any address', Severity.LOW);
    }
    const requestAddress: InsertAndGetAddressIdInput = {
        cityValue: address.city ? address.city : null ,
        streetValue: address?.street ? address.street : null,
        floorValue: address?.floor ? address?.floor : null,
        houseNumValue: address?.houseNum ? address?.houseNum : null,
    }
    if (!addressId){
        updatePersonalDetailsLogger.info(`launching the graphql API request for address creation with the parameters: ${JSON.stringify(requestAddress)}`, Severity.LOW);
        graphqlRequest(CREATE_ADDRESS, response.locals, { input: requestAddress})
        .then((result) => {
            updatePersonalDetailsLogger.info('got response from the DB for address creation', Severity.LOW);
            savePersonalDetails(request, response, result.data.insertAndGetAddressId.integer)
        })
        .catch(err => {
            updatePersonalDetailsLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).json({message: 'failed to save the personal details address due to ' + err});
        });
    } else {
        updatePersonalDetailsLogger.info(`launching the graphql API request for update address with the id of ${addressId} with the parameters: ${JSON.stringify(requestAddress)}`, Severity.LOW);
        graphqlRequest(UPDATE_ADDRESS, response.locals, { id: addressId, addressPatch: address })
        .then((result) => {
            updatePersonalDetailsLogger.info('got response from the DB for address update', Severity.LOW);
            savePersonalDetails(request, response, result.data.updateAddressById.address.id)
        })
        .catch(err => {
            updatePersonalDetailsLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).json({message: 'failed to save the personal details address due to ' + err});
        });
    }
});

export default personalDetailsRoute;
