
import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { CREATE_ADDRESS } from '../../DBService/Address/Mutation';
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Occupations',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_OCCUPATIONS, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Occupations',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Fetching Occupations',
            step: `got error when approaching the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/hmos', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching HMOs',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_HMOS, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching HMOs',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Fetching HMOs',
            step: `got error when approaching the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/investigatedPatientRoles', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching investigated patient roles',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_ALL_INVESTIGATED_PATIENT_ROLES, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching investigated patient roles',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.send(result?.data?.allInvestigatedPatientRoles?.nodes);
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Fetching investigated patient roles',
            step: `got error when approaching the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Personal Details',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, {id: +request.query.epidemioligyNumber})
    .then((result: GetInvestigatedPatientDetails) => {
        if (result?.data?.investigationByEpidemiologyNumber?.investigatedPatientByInvestigatedPatientId) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Fetching Personal Details',
                step: 'got respond from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            const investigatedPatientDetails = result.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
            response.send(convertPatientDetailsFromDB(investigatedPatientDetails));
        } else {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Fetching Personal Details',
                step: 'got invalid reponse from the DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            response.status(errorStatusCode).json({error: 'failed to fetch personal details'});
        }
    })
    .catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Personal Details',
            step: `got error while accessing the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Sub Occupation by Parent Occupation',
        step: `launcing DB request with parameter ${request.query.parentOccupation}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, {parentOccupation: request.query.parentOccupation}).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Sub Occupation by Parent Occupation',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Sub Occupation by Parent Occupation',
            step: `got error while accessing the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.sendStatus(errorStatusCode);
    });
});

personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Education Sub Occupation by City',
        step: `launcing DB request with parameter ${request.query.city}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, {city: request.query.city}).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Education Sub Occupation by City',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Education Sub Occupation by City',
            step: `got error while accessing the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
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

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Saving personal details tab',
        step: `launching update personal info with the parameters ${JSON.stringify(dbPersonalInfoData)}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, response.locals, dbPersonalInfoData).then((result: any) => {
        const dbCovidPatientPersonalInfo = {
            id: result.data.updateInvestigatedPatientById.covidPatientByCovidPatient.epidemiologyNumber,
            primaryPhone: personalInfoData.phoneNumber,
            address
        }
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Saving personal details tab',
            step: `saved personal info now saving covid patient personal info with parameters ${JSON.stringify(dbCovidPatientPersonalInfo)}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        graphqlRequest(UPDATE_COVID_PATIENT_PERSONAL_INFO,  response.locals, dbCovidPatientPersonalInfo).then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Saving personal details tab',
                step: 'saved covid patient personal info',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Saving personal details tab',
                step: 'error in requesting graphql API request in UPDATE_COVID_PATIENT_PERSONAL_INFO request due to ' + err,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).json({message: 'failed to save the personal details covid patient details'});
        });
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Saving personal details tab',
            step: 'error in requesting graphql API request in UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO request due to ' + err,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).json({message: 'failed to save the personal details investigated patient details'});
    });
}

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    const address = request.body.personalInfoData.address;
    if (address === null || address === undefined) {
        logger.info({
            service: Service.SERVER,
            severity: Severity.MEDIUM,
            workflow: 'Saving personal details tab',
            step: 'didnt get any address',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
    }
    const requestAddress: InsertAndGetAddressIdInput = {
        cityValue: address.city ? address.city : null ,
        streetValue: address?.street ? address.street : null,
        floorValue: address?.floor ? address?.floor : null,
        houseNumValue: address?.houseNum ? address?.houseNum : null,
    }
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Saving personal details tab',
        step: `launching the graphql API request for address creation with the parameters: ${JSON.stringify(requestAddress)}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(CREATE_ADDRESS,  response.locals, { input: requestAddress})
    .then((result) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Saving personal details tab',
            step: 'got response from the DB for address creation',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        savePersonalDetails(request, response, result.data.insertAndGetAddressId.integer)
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Saving personal details tab',
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).json({message: 'failed to save the personal details address due to ' + err});
    });
});

export default personalDetailsRoute;
