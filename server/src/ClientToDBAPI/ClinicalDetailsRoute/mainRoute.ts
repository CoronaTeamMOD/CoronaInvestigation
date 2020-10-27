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
    GET_CORONA_TEST_DATE_OF_PATIENT, UPDATE_IS_DECEASED, UPDATE_IS_CURRENTLY_HOSPITIALIZED
} from '../../DBService/ClinicalDetails/Query';
import {
    ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, UPDATE_INVESTIGATION
} from '../../DBService/ClinicalDetails/Mutation';
import { GetInvestigatedPatientClinicalDetailsFields } from '../../Models/ClinicalDetails/GetInvestigatedPatientClinicalDetailsFields';

const complexityCalculationMessage = 'patient clinical details by status';
const clinicalDetailsRoute = Router();
const errorStatusCode = 500;

clinicalDetailsRoute.post('/symptoms', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Symptoms',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_SYMPTOMS, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Symptoms',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Fetching Symptoms',
            step: `got error when approaching the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.sendStatus(errorStatusCode);
    });
});

clinicalDetailsRoute.post('/backgroundDiseases', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Background Diseases',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_BACKGROUND_DISEASES, response.locals).then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Background Diseases',
            step: 'got respond from DB',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        })
        response.send(result)
    }).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Fetching Background Diseases',
            step: `got error when approaching the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Fetching Clinical Details',
        step: 'launching DB request',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })
    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, { epidemiologyNumber: +request.query.epidemiologyNumber }).then(
        (result: GetInvestigatedPatientClinicalDetailsFields) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Fetching Clinical Details',
                step: 'got respond from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            })
            if (result?.data?.investigationByEpidemiologyNumber) {
                response.send(convertClinicalDetailsFromDB(result));
            }
            response.send(result)
        }
    ).catch(error => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Fetching Clinical Details',
            step: `got error while accessing the graphql API: ${error}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
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

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Saving clinical details tab',
        step: `launching update clinical info with the parameters ${JSON.stringify(requestInvestigation)}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(UPDATE_INVESTIGATION, response.locals, requestInvestigation).then(() => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Saving clinical details tab',
            step: `saved clinical info now adding background diseases with the parameters ${JSON.stringify(investigatedPatientBackgroundDeseases)}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        graphqlRequest(ADD_BACKGROUND_DISEASES, response.locals, investigatedPatientBackgroundDeseases).then(() => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Saving clinical details tab',
                step: `background diseases were added now adding symptoms with the parameters ${JSON.stringify(investigatedPatientSymptoms)}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            graphqlRequest(ADD_SYMPTOMS, response.locals, investigatedPatientSymptoms).then(() => {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Saving clinical details tab',
                    step: `symptoms were added now saving covid patient clinical info with the parameters ${JSON.stringify(investigatedPatientClinicalInfo)}`,
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                });
                graphqlRequest(UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, response.locals, investigatedPatientClinicalInfo).then(() => {
                    logger.info({
                        service: Service.SERVER,
                        severity: Severity.LOW,
                        workflow: 'Saving clinical details tab',
                        step: 'saved covid patient clinical info',
                        investigation: response.locals.epidemiologynumber,
                        user: response.locals.user.id
                    });
                    response.send('Added clinical details');
                }).catch(err => {
                    logger.error({
                        service: Service.SERVER,
                        severity: Severity.HIGH,
                        workflow: 'Saving personal details tab',
                        step: 'error in requesting graphql API request in UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS request',
                        investigation: response.locals.epidemiologynumber,
                        user: response.locals.user.id
                    });
                    response.status(errorStatusCode).send(err)
                });
            }).catch(err => {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Saving personal details tab',
                    step: 'error in requesting graphql API request in ADD_SYMPTOMS request',
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                });
                response.status(errorStatusCode).send(err)
            });
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Saving personal details tab',
                step: 'error in requesting graphql API request in ADD_BACKGROUND_DISEASES request',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(err)
        });
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Saving personal details tab',
            step: 'error in requesting graphql API request in UPDATE_INVESTIGATION request',
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send(err)
    });;
}

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const isolationAddress = request.body.clinicalDetails?.isolationAddress;

    if (isolationAddress !== null) {
        const requestAddress: InsertAndGetAddressIdInput = {
            cityValue: isolationAddress?.city ? isolationAddress?.city : null,
            streetValue: isolationAddress?.street ? isolationAddress?.street : null,
            floorValue: isolationAddress?.floor ? isolationAddress?.floor : null,
            houseNumValue: isolationAddress?.houseNum ? isolationAddress?.houseNum : null,
        }
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Saving clinical details tab',
            step: `launching the graphql API request for address creation with the parameters: ${JSON.stringify(requestAddress)}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        graphqlRequest(CREATE_ADDRESS, response.locals, {
            input: requestAddress
        }).then((result: CreateAddressResponse) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Saving clinical details tab',
                step: 'got response from the DB for address creation',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            saveClinicalDetails(request, response, result.data.insertAndGetAddressId.integer);
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Saving clinical details tab',
                step: `got errors approaching the graphql API ${err}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(err);
        });
    } else {
        saveClinicalDetails(request, response, null);
    }
});

clinicalDetailsRoute.get('/coronaTestDate/:investigationId', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting corona test date of patient',
        step: `launcing DB request with parameter ${request.params.investigationId}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_CORONA_TEST_DATE_OF_PATIENT, response.locals, { currInvestigation: Number(request.params.investigationId) })
        .then((result: CoronaTestDateQueryResult) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting corona test date of patient',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.send(result.data.allInvestigations.nodes[0]);
        }).catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting corona test date of patient',
                step: `got errors approaching the graphql API ${err}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(err);
        });
});

clinicalDetailsRoute.post('/isDeceased/:investigatedPatientId/:isDeceased', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Updating is deceased value',
        step: `launcing DB request with parameter ${request.params.investigationId}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(UPDATE_IS_DECEASED, response.locals, {
        investigatedPatientId: +request.params.investigatedPatientId, isDeceased: Boolean(request.params.isDeceased)
    }).then(result => {
        if (result.data) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: `Updating is deceased value to ${request.params.isDeceased}`,
                step: `got response from DB ${result}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }
        else {
            return Promise.reject(JSON.stringify(result));
        }
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: `Updating is deceased value to ${request.params.isDeceased}`,
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send(err);
    });
});

clinicalDetailsRoute.post('/isCurrentlyHospitialized/:investigatedPatientId/:isCurrentlyHospitalized', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Updating is currently hospitalized value',
        step: `launcing DB request with parameter ${request.params.investigationId}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(UPDATE_IS_CURRENTLY_HOSPITIALIZED, response.locals, {
        investigatedPatientId: +request.params.investigatedPatientId, isCurrentlyHospitalized: Boolean(request.params.isCurrentlyHospitalized)
    }).then(result => {
        console.log("RES: ", result)
        if (result.data) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: `Updating is currently hospitalized value to ${request.params.isCurrentlyHospitalized}`,
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            calculateInvestigationComplexity(request, response, complexityCalculationMessage);
        }
        else {
            return Promise.reject(JSON.stringify(result));
        }
    }).catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: `Updating is currently hospitalized value to ${request.params.isCurrentlyHospitalized}`,
            step: `got errors approaching the graphql API ${err}`,
            investigation: response.locals.epidemiologynumber,
            user: response.locals.user.id
        });
        response.status(errorStatusCode).send(err);
    });
});

export default clinicalDetailsRoute;
