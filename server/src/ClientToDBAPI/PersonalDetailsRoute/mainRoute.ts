
import { Router, Request, Response } from 'express';

import { InitialLogData, Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { formatToInsertAndGetAddressIdInput } from '../../Utils/addressUtils';
import { CREATE_ADDRESS, UPDATE_ADDRESS } from '../../DBService/Address/Mutation';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { calculateInvestigationComplexity } from '../../Utils/InvestigationComplexity/InvestigationComplexity';
import GetInvestigatedPatientDetails, { PersonalInfoDbData } from '../../Models/PersonalInfo/GetInvestigatedPatientDetails';
import { UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, UPDATE_COVID_PATIENT_PERSONAL_INFO } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY, GET_ALL_INVESTIGATED_PATIENT_ROLES } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/occupations', (request: Request, response: Response) => {
    const occupationsLogger = logger.setup({
        workflow: 'query all occupations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    occupationsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_OCCUPATIONS, response.locals).then((result: any) => {
        occupationsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        occupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/hmos', (request: Request, response: Response) => {
    const hmosLogger = logger.setup({
        workflow: 'query all hmos',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    hmosLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_HMOS, response.locals)
    .then(result => {
        hmosLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result)
    }).catch(error => {
        hmosLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/investigatedPatientRoles', (request: Request, response: Response) => {
    const investigatedPatientRolesLogger = logger.setup({
        workflow: 'query all investigated patient roles',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigatedPatientRolesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATED_PATIENT_ROLES, response.locals)
    .then(result => {
        investigatedPatientRolesLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allInvestigatedPatientRoles.nodes);
    }).catch(error => {
        investigatedPatientRolesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
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
        workflow: 'query investigation personal info tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {id: parseInt(request.query.epidemioligyNumber as string)};
    investigatedPatientPersonalInfoFieldsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, parameters)
    .then((result: GetInvestigatedPatientDetails) => {
        investigatedPatientPersonalInfoFieldsLogger.info(validDBResponseLog, Severity.LOW);
        const investigatedPatientDetails = result.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
        response.send(convertPatientDetailsFromDB(investigatedPatientDetails));
    })
    .catch(error => {
        investigatedPatientPersonalInfoFieldsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    const subOccupationsLogger = logger.setup({
        workflow: 'query sub occupations by main occupation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {parentOccupation: request.query.parentOccupation};
    subOccupationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, parameters)
    .then(result => {
        subOccupationsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result)
    }).catch(error => {
        subOccupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    const educationSubOccupationsLogger = logger.setup({
        workflow: 'query education sub occupation by city',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {city: request.query.city};
    educationSubOccupationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, parameters)
    .then(result => {
        educationSubOccupationsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        educationSubOccupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

const savePersonalDetails = (request: Request, response: Response, baseLog: InitialLogData, address?: number, ) => {
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

    const saveInvestigatedPatientLogger = logger.setup({...baseLog, workflow: `${baseLog.workflow}: save investigated patient fields`});
    saveInvestigatedPatientLogger.info(launchingDBRequestLog(dbPersonalInfoData), Severity.LOW);

    graphqlRequest(UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO, response.locals, dbPersonalInfoData)
    .then(result => {
        saveInvestigatedPatientLogger.info(validDBResponseLog, Severity.LOW);
        const dbCovidPatientPersonalInfo = {
            id: result.data.updateInvestigatedPatientById.covidPatientByCovidPatient.epidemiologyNumber,
            primaryPhone: personalInfoData.phoneNumber,
            address
        }
        const updateCovidPatientLogger = logger.setup({...baseLog, workflow: `${baseLog.workflow}: save covid patient fields`});
        updateCovidPatientLogger.info(launchingDBRequestLog(dbCovidPatientPersonalInfo), Severity.LOW);
        graphqlRequest(UPDATE_COVID_PATIENT_PERSONAL_INFO,  response.locals, dbCovidPatientPersonalInfo).then((result: any) => {
            updateCovidPatientLogger.info(validDBResponseLog, Severity.LOW);
            calculateInvestigationComplexity(response, baseLog);
        }).catch(error => {
            updateCovidPatientLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
    })
    .catch(error => {
        saveInvestigatedPatientLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
}

personalDetailsRoute.post('/updatePersonalDetails', (request: Request, response: Response) => {
    const addressId = request.body.addressId;
    const address = request.body.personalInfoData.address;

    const logData = {
        workflow: 'saving personal details tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    };
    const requestAddress: InsertAndGetAddressIdInput = formatToInsertAndGetAddressIdInput(address);

    if (!addressId) {
        const createAddressLogger = logger.setup({...logData, workflow: `${logData.workflow}: create patient address`});
        const parameters = {input: requestAddress};
        createAddressLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
        graphqlRequest(CREATE_ADDRESS,  response.locals, parameters)
        .then((result) => {
            createAddressLogger.info(validDBResponseLog, Severity.LOW);
            savePersonalDetails(request, response, logData, result.data.insertAndGetAddressId.integer);
        })
        .catch(error => {
            createAddressLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
    } else {
        const updateAddressLogger = logger.setup({...logData, workflow: `${logData.workflow}: update patient address`});
        const parameters = { id: addressId, addressPatch: address };
        updateAddressLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
        graphqlRequest(UPDATE_ADDRESS,  response.locals, parameters)
        .then((result) => {
            updateAddressLogger.info(validDBResponseLog, Severity.LOW);
            savePersonalDetails(request, response, logData, result.data.updateAddressById.address.id);
        })
        .catch(error => {
            updateAddressLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode).send(error);
        });
    }
});

export default personalDetailsRoute;
