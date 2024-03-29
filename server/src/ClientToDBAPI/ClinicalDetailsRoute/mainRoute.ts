import { Router, Request, Response } from 'express';

import { CREATE_ADDRESS } from '../../DBService/Address/Mutation';
import { InitialLogData, Severity } from '../../Models/Logger/types';
import CreateAddressResponse from '../../Models/Address/CreateAddress';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import { SAVE_CLINICAL_DETAILS } from '../../DBService/ClinicalDetails/Mutation';
import InsertAndGetAddressIdInput from '../../Models/Address/InsertAndGetAddressIdInput';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import { errorStatusCode, graphqlRequest, validStatusCode } from '../../GraphqlHTTPRequest';
import { formatToInsertAndGetAddressIdInput, formatToNullable} from '../../Utils/addressUtils';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { calculateInvestigationComplexity } from '../../Utils/InvestigationComplexity/InvestigationComplexity';
import {
    GET_ALL_SYMPTOMS, GET_BACKGROUND_DISEASES, GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER,
    UPDATE_IS_DECEASED, UPDATE_IS_CURRENTLY_HOSPITIALIZED, GET_ISOLATION_SOURCES
} from '../../DBService/ClinicalDetails/Query';
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
        response.send(result.data.allIsolationSources.nodes);
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

clinicalDetailsRoute.get('/getInvestigatedPatientClinicalDetailsFields', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const fetchClinicalDetailsFieldsLogger = logger.setup({
        workflow: 'qurey investigation clinical details',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    })

    const parameters = { epidemiologyNumber };
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

const saveClinicalDetails = (request: Request, response: Response, baseLog: InitialLogData, isolationAddress: number) => {
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: ClinicalDetails = {
        epidemiologyNumber: clinicalDetails.epidemiologyNumber,
        hospital: clinicalDetails.hospital,
        hospitalizationEndDate: clinicalDetails.hospitalizationEndDate,
        hospitalizationStartDate: clinicalDetails.hospitalizationStartDate,
        isInIsolation: clinicalDetails.isInIsolation,
        isIsolationProblem: clinicalDetails.isIsolationProblem,
        isIsolationProblemMoreInfo: clinicalDetails.isIsolationProblemMoreInfo,
        isolationEndDate: clinicalDetails.isolationEndDate,
        isolationStartDate: clinicalDetails.isolationStartDate,
        symptomsStartDate: clinicalDetails.symptomsStartDate,
        doesHaveSymptoms: clinicalDetails.doesHaveSymptoms,
        wasHospitalized: clinicalDetails.wasHospitalized,
        otherSymptomsMoreInfo: clinicalDetails.otherSymptomsMoreInfo,
        isolationSource: clinicalDetails.isolationSource,
        isolationSourceDesc: clinicalDetails.isolationSourceDesc,
        isolationAddressId: isolationAddress || null,
        investigatedPatientId: clinicalDetails.investigatedPatientId,
        backgroundDeseases: clinicalDetails.backgroundDeseases,
        symptoms: clinicalDetails.symptoms,
        isPregnant: clinicalDetails.isPregnant,
        doesHaveBackgroundDiseases: clinicalDetails.doesHaveBackgroundDiseases,
        otherBackgroundDiseasesMoreInfo: clinicalDetails.otherBackgroundDiseasesMoreInfo,
        wasInstructedToBeInIsolation: clinicalDetails.wasInstructedToBeInIsolation, 
    };
    const parameters = {input: JSON.stringify(requestInvestigation)};

    const saveClinicalDetailsFunctionLogger = logger.setup({
        ...baseLog,
        workflow: `${baseLog.workflow}: investigation table fields`,
    });
    saveClinicalDetailsFunctionLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(SAVE_CLINICAL_DETAILS, response.locals, parameters).then(() => {
        saveClinicalDetailsFunctionLogger.info(validDBResponseLog, Severity.LOW);
        response.sendStatus(validStatusCode);
    }).catch(error => {
        saveClinicalDetailsFunctionLogger.error(invalidDBResponseLog(error),Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
}

clinicalDetailsRoute.post('/saveClinicalDetails', handleInvestigationRequest, (request: Request, response: Response) => {
    const logData = {
        workflow: `saving clinical details tab`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };
    const isolationAddress = formatToNullable(request.body.clinicalDetails?.isolationAddress);
    if (isolationAddress !== null) {
        const requestAddress: InsertAndGetAddressIdInput = formatToInsertAndGetAddressIdInput(isolationAddress);
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
    }
});

clinicalDetailsRoute.get('/isDeceased/:investigatedPatientId/:isDeceased', handleInvestigationRequest, (request: Request, response: Response) => {
    const logData = {
        workflow: 'update whether the pateint is deceased',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };
    const isDeceasedLogger = logger.setup(logData);

    const parameters = {
        isDeceased: Boolean(request.params.isDeceased),
        investigatedPatientId: parseInt(request.params.investigatedPatientId)
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

clinicalDetailsRoute.get('/isCurrentlyHospitialized/:investigatedPatientId/:isCurrentlyHospitalized', handleInvestigationRequest, (request: Request, response: Response) => {
    const logData = {
        workflow: 'update whether the pateint is currently hospitialized',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    };
    const isHospitializedLogger = logger.setup(logData);

    const parameters = {
        investigatedPatientId: parseInt(request.params.investigatedPatientId),
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
