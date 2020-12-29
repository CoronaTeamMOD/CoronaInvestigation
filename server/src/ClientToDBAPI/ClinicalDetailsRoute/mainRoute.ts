import { Router, Request, Response } from 'express';

import { CREATE_ADDRESS, UPDATE_ADDRESS } from '../../DBService/Address/Mutation';
import { InitialLogData, Severity } from '../../Models/Logger/types';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import CreateAddressResponse from '../../Models/Address/CreateAddress';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import { formatToInsertAndGetAddressIdInput } from '../../Utils/addressUtils';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import CoronaTestDateQueryResult from '../../Models/ClinicalDetails/CoronaTestDateQueryResult';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { calculateInvestigationComplexity } from '../../Utils/InvestigationComplexity/InvestigationComplexity';
import {
    GET_ALL_SYMPTOMS, GET_BACKGROUND_DISEASES, GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER,
    GET_CORONA_TEST_DATE_OF_PATIENT, UPDATE_IS_DECEASED, UPDATE_IS_CURRENTLY_HOSPITIALIZED, GET_ISOLATION_SOURCES
} from '../../DBService/ClinicalDetails/Query';
import {
    ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, UPDATE_INVESTIGATION
} from '../../DBService/ClinicalDetails/Mutation';
import { GetInvestigatedPatientClinicalDetailsFields } from '../../Models/ClinicalDetails/GetInvestigatedPatientClinicalDetailsFields';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/symptoms', (request: Request, response: Response) => {
    const symptomsLogger = logger.setup({
        workflow: 'query all symptoms',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });

    symptomsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_SYMPTOMS, response.locals)
    .then(result => {
        symptomsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        symptomsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(error);
    });
});

clinicalDetailsRoute.get('/backgroundDiseases', (request: Request, response: Response) => {
    const backgroundDiseasesLogger = logger.setup({
        workflow: 'query all background diseases',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });

    backgroundDiseasesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_BACKGROUND_DISEASES, response.locals)
    .then(result => {
        backgroundDiseasesLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        backgroundDiseasesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(error);
    });
});

clinicalDetailsRoute.get('/isolationSources', (request: Request, response: Response) => {
    const isolationSourcesLogger = logger.setup({
        workflow: 'query all isolation sources',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })

    isolationSourcesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ISOLATION_SOURCES, response.locals)
    .then(result => {
        isolationSourcesLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result?.data?.allIsolationSources?.nodes || []);
    }).catch(error => {
        isolationSourcesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(error);
    });
});

const convertClinicalDetailsFromDB = (result: GetInvestigatedPatientClinicalDetailsFields) => {
    const clinicalDetails = result.data.investigationByEpidemiologyNumber;
    const convertedClincalDetails = {
        ...clinicalDetails,
        symptoms: clinicalDetails.symptoms.nodes
            .map((symptom: any) => symptom.symptomName),
        ...clinicalDetails.investigatedPatientByInvestigatedPatientId,
        backgroundDiseases: clinicalDetails.investigatedPatientByInvestigatedPatientId.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes
            .map((backgroudDisease: any) => backgroudDisease.backgroundDeseasName)
    }

    delete convertedClincalDetails.investigatedPatientByInvestigatedPatientId;
    delete convertedClincalDetails.investigatedPatientBackgroundDiseasesByInvestigatedPatientId;

    return convertedClincalDetails;
}

clinicalDetailsRoute.get('/getInvestigatedPatientClinicalDetailsFields', (request: Request, response: Response) => {
    
    const fetchClinicalDetailsFieldsLogger = logger.setup({
        workflow: 'qurey investigation clinical details',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })

    const parameters = { epidemiologyNumber: +request.query.epidemiologyNumber };
    fetchClinicalDetailsFieldsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, parameters).then(
        (result: GetInvestigatedPatientClinicalDetailsFields) => {
            fetchClinicalDetailsFieldsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(convertClinicalDetailsFromDB(result));
        }
    ).catch(error => {
        fetchClinicalDetailsFieldsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(error);
    });
});

const saveClinicalDetails = (request: Request, response: Response, baseLog: InitialLogData, isolationAddress?: number) => {
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
        isolationAddress: isolationAddress || null
    };
    const saveClinicalInvestigationLogger = logger.setup({
        ...baseLog,
        workflow: `${baseLog.workflow}: investigation table fields`,
    });
    saveClinicalInvestigationLogger.info(launchingDBRequestLog(requestInvestigation), Severity.LOW);

    graphqlRequest(UPDATE_INVESTIGATION, response.locals, requestInvestigation).then(() => {
        saveClinicalInvestigationLogger.info(validDBResponseLog, Severity.LOW);
        const addBackgroundDiseasesLogger = logger.setup({
            ...baseLog,
            workflow: `${baseLog.workflow}: add background diseases`,
        });
        const patientBackgroundDiseases = {
            investigatedPatientId: clinicalDetails.investigatedPatientId,
            backgroundDiseases: clinicalDetails.backgroundDeseases
        };
        addBackgroundDiseasesLogger.info(launchingDBRequestLog(patientBackgroundDiseases), Severity.LOW);

        graphqlRequest(ADD_BACKGROUND_DISEASES, response.locals, patientBackgroundDiseases).then(() => {
            addBackgroundDiseasesLogger.info(validDBResponseLog, Severity.LOW);
            const addSymptomsLogger = logger.setup({
                ...baseLog,
                workflow: `${baseLog.workflow}: add symptoms`,
            });
            const investigatedPatientSymptoms = {
                investigationIdValue: clinicalDetails.epidemiologyNumber,
                symptomNames: clinicalDetails.symptoms
            };
            addSymptomsLogger.info(launchingDBRequestLog(investigatedPatientSymptoms), Severity.LOW);

            graphqlRequest(ADD_SYMPTOMS, response.locals, investigatedPatientSymptoms).then(() => {
                addSymptomsLogger.info(validDBResponseLog, Severity.LOW);
                const saveInvestigatedPatientFieldsLogger = logger.setup({
                    ...baseLog,
                    workflow: `${baseLog.workflow}: investigated patient table fields`,
                });                
                const investigatedPatientClinicalInfo = {
                    isPregnant: clinicalDetails.isPregnant,
                    doesHaveBackgroundDiseases: clinicalDetails.doesHaveBackgroundDiseases,
                    id: clinicalDetails.investigatedPatientId,
                    otherBackgroundDiseasesMoreInfo: clinicalDetails.otherBackgroundDiseasesMoreInfo
                };
                saveInvestigatedPatientFieldsLogger.info(launchingDBRequestLog(investigatedPatientClinicalInfo), Severity.LOW);

                graphqlRequest(UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, response.locals, investigatedPatientClinicalInfo).then(() => {
                    saveInvestigatedPatientFieldsLogger.info(validDBResponseLog, Severity.LOW);
                    const allClinicalDetailsLogger = logger.setup(baseLog); 
                    allClinicalDetailsLogger.info(validDBResponseLog, Severity.LOW);     
                    response.send('Added clinical details');
                }).catch(error => {
                    saveInvestigatedPatientFieldsLogger.error(invalidDBResponseLog(error),Severity.HIGH);
                    response.status(errorStatusCode).send(error);
                });
            }).catch(error => {
                addSymptomsLogger.error(invalidDBResponseLog(error),Severity.HIGH);
                response.status(errorStatusCode).send(error);
            });
        }).catch(error => {
            addBackgroundDiseasesLogger.error(invalidDBResponseLog(error),Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
    }).catch(error => {
        saveClinicalInvestigationLogger.error(invalidDBResponseLog(error),Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
}

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {
    const isolationAddressId = request.body.clinicalDetails?.isolationAddressId;
    const isolationAddress = request.body.clinicalDetails?.isolationAddress;
    const logData = {
        workflow: `saving clinical details tab`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };

    const requestAddress: InsertAndGetAddressIdInput = formatToInsertAndGetAddressIdInput(isolationAddress);
    if (!isolationAddressId) {
        const createAddressLogger = logger.setup({...logData, workflow: `${logData.workflow}: create isolation address`})

        const parameters = {input: requestAddress};
        createAddressLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

        graphqlRequest(CREATE_ADDRESS, response.locals, parameters)
        .then((result: CreateAddressResponse) => {
            createAddressLogger.info(validDBResponseLog, Severity.LOW);
            saveClinicalDetails(request, response, logData, result.data.insertAndGetAddressId.integer);
        }).catch(error => {
            createAddressLogger.error(invalidDBResponseLog(error),Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
    } else {
        const updateAddressLogger = logger.setup({...logData, workflow: `${logData.workflow}: update isolation address`})

        const parameters = {id: isolationAddressId, addressPatch: isolationAddress};
        updateAddressLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

        graphqlRequest(UPDATE_ADDRESS, response.locals, parameters)
        .then((result: CreateAddressResponse) => {
            updateAddressLogger.info(validDBResponseLog, Severity.LOW);
            saveClinicalDetails(request, response, logData, result.data.insertAndGetAddressId.integer);
        }).catch(error => {
            updateAddressLogger.error(invalidDBResponseLog(error),Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
    }
});

clinicalDetailsRoute.get('/coronaTestDate', (request: Request, response: Response) => {
    const coronaTestDateLogger = logger.setup({
        workflow: 'query test date and symptoms data of patient',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    const parameters = {currInvestigation: +response.locals.epidemiologynumber};
    coronaTestDateLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_CORONA_TEST_DATE_OF_PATIENT, response.locals, parameters)
    .then((result: CoronaTestDateQueryResult) => {
        coronaTestDateLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result.data.allInvestigations.nodes[0]);
    }).catch(error => {
        coronaTestDateLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

clinicalDetailsRoute.get('/isDeceased/:investigatedPatientId/:isDeceased', (request: Request, response: Response) => {
    const logData = {
        workflow: 'update whether the pateint is deceased',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };
    const isDeceasedLogger = logger.setup(logData);

    const parameters = {
        isDeceased: Boolean(request.params.isDeceased),
        investigatedPatientId: +request.params.investigatedPatientId
    };
    isDeceasedLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_IS_DECEASED, response.locals, parameters)
    .then(() => {
        isDeceasedLogger.info(validDBResponseLog, Severity.LOW);
        calculateInvestigationComplexity(response, logData);
    }).catch(error => {
        isDeceasedLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

clinicalDetailsRoute.get('/isCurrentlyHospitialized/:investigatedPatientId/:isCurrentlyHospitalized', (request: Request, response: Response) => {
    const logData = {
        workflow: 'update whether the pateint is currently hospitialized',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };
    const isHospitializedLogger = logger.setup(logData);

    const parameters = {
        investigatedPatientId: +request.params.investigatedPatientId, 
        isCurrentlyHospitalized: Boolean(request.params.isCurrentlyHospitalized)
    }
    isHospitializedLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    
    graphqlRequest(UPDATE_IS_CURRENTLY_HOSPITIALIZED, response.locals, parameters)
    .then(() => {
        isHospitializedLogger.info(validDBResponseLog, Severity.LOW);
        calculateInvestigationComplexity(response, logData);
    }).catch(error => {
        isHospitializedLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

export default clinicalDetailsRoute;
