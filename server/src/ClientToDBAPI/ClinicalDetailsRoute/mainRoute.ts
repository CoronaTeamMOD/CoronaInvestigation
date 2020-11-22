import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { CREATE_ADDRESS } from '../../DBService/Address/Mutation';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import CreateAddressResponse from '../../Models/Address/CreateAddress';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import CoronaTestDateQueryResult from '../../Models/ClinicalDetails/CoronaTestDateQueryResult';
import { calculateInvestigationComplexity } from '../..//Utils/InvestigationComplexity/InvestigationComplexity';
import {
    GET_SYMPTOMS, GET_BACKGROUND_DISEASES, GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER,
    GET_CORONA_TEST_DATE_OF_PATIENT, UPDATE_IS_DECEASED, UPDATE_IS_CURRENTLY_HOSPITIALIZED, GET_ISOLATION_SOURCES
} from '../../DBService/ClinicalDetails/Query';
import {
    ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, UPDATE_INVESTIGATION
} from '../../DBService/ClinicalDetails/Mutation';
import { GetInvestigatedPatientClinicalDetailsFields } from '../../Models/ClinicalDetails/GetInvestigatedPatientClinicalDetailsFields';

const complexityCalculationMessage = 'patient clinical details by status';
const clinicalDetailsRoute = Router();
const errorStatusCode = 500;

clinicalDetailsRoute.get('/symptoms', (request: Request, response: Response) => {
    const symptomsLogger = logger.setup({
        workflow: 'Fetching Symptoms',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    symptomsLogger.info('launching DB request', Severity.LOW)
    graphqlRequest(GET_SYMPTOMS, response.locals).then((result: any) => {
        symptomsLogger.info('got respond from DB', Severity.LOW)
        response.send(result)
    }).catch(error => {
        symptomsLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH)
        response.sendStatus(errorStatusCode);
    });
});

clinicalDetailsRoute.get('/backgroundDiseases', (request: Request, response: Response) => {
    const backgroundDiseasesLogger = logger.setup({
        workflow: 'Fetching Background Diseases',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    backgroundDiseasesLogger.info('launching DB request', Severity.LOW)
    graphqlRequest(GET_BACKGROUND_DISEASES, response.locals).then((result: any) => {
        backgroundDiseasesLogger.info('got respond from DB', Severity.LOW)
        response.send(result)
    }).catch(error => {
        backgroundDiseasesLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH)
        response.sendStatus(errorStatusCode);
    });
});

clinicalDetailsRoute.get('/isolationSources', (request: Request, response: Response) => {
    const isolationSourcesLogger = logger.setup({
        workflow: 'Fetching Isolation Source',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    isolationSourcesLogger.info('start DB request', Severity.LOW)
    graphqlRequest(GET_ISOLATION_SOURCES, response.locals).then((result: any) => {
        if(result?.data) {
            isolationSourcesLogger.info('got response from DB', Severity.LOW)
            response.send(result?.data?.allIsolationSources?.nodes)
        } else {
            isolationSourcesLogger.error(`couldnt query isolation sources due to ${result?.errors[0]?.message}`, Severity.HIGH)
            response.sendStatus(errorStatusCode);
        }
    }).catch(error => {
        isolationSourcesLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH)
        response.sendStatus(errorStatusCode);
    });
});

const convertClinicalDetailsFromDB = (result: GetInvestigatedPatientClinicalDetailsFields) => {
    const clinicalDetails = result.data.investigationByEpidemiologyNumber;
    const convertedClincalDetails = {
        ...clinicalDetails,
        isolationAddress: clinicalDetails.addressByIsolationAddress,
        symptoms: clinicalDetails.investigatedPatientSymptomsByInvestigationId.nodes
            .map((symptom: any) => symptom.symptomName),
        ...clinicalDetails.investigatedPatientByInvestigatedPatientId,
        backgroundDiseases: clinicalDetails.investigatedPatientByInvestigatedPatientId.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes
            .map((backgroudDisease: any) => backgroudDisease.backgroundDeseasName)
    }

    delete convertedClincalDetails.addressByIsolationAddress;
    delete convertedClincalDetails.investigatedPatientSymptomsByInvestigationId;
    delete convertedClincalDetails.investigatedPatientByInvestigatedPatientId;
    delete convertedClincalDetails.investigatedPatientBackgroundDiseasesByInvestigatedPatientId;

    return convertedClincalDetails;
}

clinicalDetailsRoute.get('/getInvestigatedPatientClinicalDetailsFields', (request: Request, response: Response) => {
    const fetchClinicalDetailsFieldsLogger = logger.setup({
        workflow: 'Fetching Clinical Details',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    fetchClinicalDetailsFieldsLogger.info('launching DB request', Severity.LOW)
    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, { epidemiologyNumber: +request.query.epidemiologyNumber }).then(
        (result: GetInvestigatedPatientClinicalDetailsFields) => {
            fetchClinicalDetailsFieldsLogger.info('got respond from DB', Severity.LOW)
            if (result?.data?.investigationByEpidemiologyNumber) {
                response.send(convertClinicalDetailsFromDB(result));
            } else {
                response.send(result)
            }
        }
    ).catch(error => {
        fetchClinicalDetailsFieldsLogger.error(`got error while accessing the graphql API: ${error}`, Severity.HIGH)
        response.sendStatus(errorStatusCode);
    });
});

const saveClinicalDetails = (request: Request, response: Response, isolationAddress?: number, ) => {
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: Investigation = {
        epidemiologyNumber: clinicalDetails.epidemiologyNumber,
        hospital: clinicalDetails.hospital,
        hospitalizationEndTime: clinicalDetails.hospitalizationEndDate,
        hospitalizationStartTime: clinicalDetails.hospitalizationStartDate,
        isInIsolation: clinicalDetails.isInIsolation,
        isIsolationProblem: clinicalDetails.isIsolationProblem,
        isIsolationProblemMoreInfo: clinicalDetails.isIsolationProblemMoreInfo,
        isolationEndTime: clinicalDetails.isolationEndDate,
        isolationStartTime: clinicalDetails.isolationStartDate,
        symptomsStartTime: clinicalDetails.symptomsStartDate,
        doesHaveSymptoms: clinicalDetails.doesHaveSymptoms,
        wasHospitalized: clinicalDetails.wasHospitalized,
        otherSymptomsMoreInfo: clinicalDetails.otherSymptomsMoreInfo,
        isolationSource: clinicalDetails.isolationSource,
        isolationAddress
    }
    const investigatedPatientBackgroundDeseases = {
        investigatedPatientId: clinicalDetails.investigatedPatientId,
        backgroundDeseases: clinicalDetails.backgroundDeseases
    };
    const investigatedPatientSymptoms = {
        investigationIdValue: clinicalDetails.epidemiologyNumber,
        symptomNames: clinicalDetails.symptoms
    }
    const investigatedPatientClinicalInfo = {
        isPregnant: clinicalDetails.isPregnant,
        doesHaveBackgroundDiseases: clinicalDetails.doesHaveBackgroundDiseases,
        id: clinicalDetails.investigatedPatientId,
        otherBackgroundDiseasesMoreInfo: clinicalDetails.otherBackgroundDiseasesMoreInfo
    }

    const saveClinicalDetailsFieldsLogger = logger.setup({
        workflow: 'Saving clinical details tab',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })

    saveClinicalDetailsFieldsLogger.info(`launching update clinical info with the parameters ${JSON.stringify(requestInvestigation)}`, Severity.LOW)
    graphqlRequest(UPDATE_INVESTIGATION, response.locals, requestInvestigation).then(() => {
        saveClinicalDetailsFieldsLogger.info(`saved clinical info now adding background diseases with the parameters ${JSON.stringify(investigatedPatientBackgroundDeseases)}`, Severity.LOW)
        graphqlRequest(ADD_BACKGROUND_DISEASES, response.locals, investigatedPatientBackgroundDeseases).then(() => {
            saveClinicalDetailsFieldsLogger.info(`background diseases were added now adding symptoms with the parameters ${JSON.stringify(investigatedPatientSymptoms)}`, Severity.LOW)
            graphqlRequest(ADD_SYMPTOMS, response.locals, investigatedPatientSymptoms).then(() => {
                saveClinicalDetailsFieldsLogger.info(`symptoms were added now saving covid patient clinical info with the parameters ${JSON.stringify(investigatedPatientClinicalInfo)}`, Severity.LOW)
                graphqlRequest(UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, response.locals, investigatedPatientClinicalInfo).then(() => {
                    saveClinicalDetailsFieldsLogger.info('saved covid patient clinical info', Severity.LOW)
                    response.send('Added clinical details');
                }).catch(err => {
                    saveClinicalDetailsFieldsLogger.error('error in requesting graphql API request in UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS request',Severity.HIGH)
                    response.status(errorStatusCode).send(err)
                });
            }).catch(err => {
                saveClinicalDetailsFieldsLogger.error('error in requesting graphql API request in ADD_SYMPTOMS request',Severity.HIGH)
                response.status(errorStatusCode).send(err)
            });
        }).catch(err => {
            saveClinicalDetailsFieldsLogger.error('error in requesting graphql API request in ADD_BACKGROUND_DISEASES request',Severity.HIGH)
            response.status(errorStatusCode).send(err)
        });
    }).catch(err => {
        saveClinicalDetailsFieldsLogger.error('error in requesting graphql API request in UPDATE_INVESTIGATION request',Severity.HIGH)
        response.status(errorStatusCode).send(err)
    });
}

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const isolationAddress = request.body.clinicalDetails?.isolationAddress;
    const saveClinicalDetailsFieldsLogger = logger.setup({
        workflow: 'Saving clinical details tab',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })

    if (isolationAddress !== null) {
        const requestAddress: InsertAndGetAddressIdInput = {
            cityValue: isolationAddress?.city ? isolationAddress?.city : null,
            streetValue: isolationAddress?.street ? isolationAddress?.street : null,
            floorValue: isolationAddress?.floor ? isolationAddress?.floor : null,
            houseNumValue: isolationAddress?.houseNum ? isolationAddress?.houseNum : null,
        }
        saveClinicalDetailsFieldsLogger.info(`launching the graphql API request for address creation with the parameters: ${JSON.stringify(requestAddress)}`, Severity.LOW)
        graphqlRequest(CREATE_ADDRESS, response.locals, {
            input: requestAddress
        }).then((result: CreateAddressResponse) => {
            saveClinicalDetailsFieldsLogger.info('got response from the DB for address creation', Severity.LOW)
            saveClinicalDetails(request, response, result.data.insertAndGetAddressId.integer);
        }).catch(err => {
            saveClinicalDetailsFieldsLogger.error(`got errors approaching the graphql API ${err}`,Severity.HIGH)
            response.status(errorStatusCode).send(err);
        });
    } else {
        saveClinicalDetails(request, response, null);
    }
});

clinicalDetailsRoute.get('/coronaTestDate/:investigationId', (request: Request, response: Response) => {
    const coronaTestDateLogger = logger.setup({
        workflow: 'Getting corona test date of patient',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    coronaTestDateLogger.info(`launcing DB request with parameter ${request.params.investigationId}`, Severity.LOW)
    graphqlRequest(GET_CORONA_TEST_DATE_OF_PATIENT, response.locals, { currInvestigation: Number(request.params.investigationId) })
        .then((result: CoronaTestDateQueryResult) => {
            coronaTestDateLogger.info('got response from DB', Severity.LOW)
            response.send(result.data.allInvestigations.nodes[0]);
        }).catch(err => {
            coronaTestDateLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH)
            response.status(errorStatusCode).send(err);
        });
});

clinicalDetailsRoute.get('/isDeceased/:investigatedPatientId/:isDeceased', (request: Request, response: Response) => {
    const isDeceasedLogger = logger.setup({
        workflow: 'Getting corona test date of patient',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    isDeceasedLogger.info(`launcing DB request with parameter ${request.params.investigationId}`, Severity.LOW)
    graphqlRequest(UPDATE_IS_DECEASED, response.locals, {
        investigatedPatientId: +request.params.investigatedPatientId, isDeceased: Boolean(request.params.isDeceased)
    }).then(result => {
        if (result.data) {
            isDeceasedLogger.info(`got response from DB ${result}`, Severity.LOW)
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }
        else {
            return Promise.reject(JSON.stringify(result));
        }
    }).catch(err => {
        isDeceasedLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH)
        response.status(errorStatusCode).json({message: 'failed to save the is deceased due to ' + err});
    });
});

clinicalDetailsRoute.get('/isCurrentlyHospitialized/:investigatedPatientId/:isCurrentlyHospitalized', (request: Request, response: Response) => {
    const isCurrentlyHospitializedLogger = logger.setup({
        workflow: 'Updating is currently hospitalized value',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    isCurrentlyHospitializedLogger.info(`launcing DB request with parameter ${request.params.investigationId}`, Severity.LOW)
    graphqlRequest(UPDATE_IS_CURRENTLY_HOSPITIALIZED, response.locals, {
        investigatedPatientId: +request.params.investigatedPatientId, isCurrentlyHospitalized: Boolean(request.params.isCurrentlyHospitalized)
    }).then(result => {
        console.log("RES: ", result)
        if (result.data) {
            isCurrentlyHospitializedLogger.info('got response from DB', Severity.LOW)
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }
        else {
            return Promise.reject(JSON.stringify(result));
        }
    }).catch(err => {
        isCurrentlyHospitializedLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH)
        response.status(errorStatusCode).json({message: 'failed to save the is currently hospitialized due to ' + err});
    });
});

export default clinicalDetailsRoute;
