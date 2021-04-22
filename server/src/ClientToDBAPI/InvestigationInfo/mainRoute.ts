import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { getPatientAge } from '../../Utils/patientUtils';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { 
    GET_INVESTIGATION_INFO, 
    GET_SUB_STATUSES_BY_STATUS, 
    GET_INVESTIGAION_SETTINGS_FAMILY_DATA,
    GROUP_ID_BY_EPIDEMIOLOGY_NUMBER,
    GET_INVESTIGATION_COMPLEXITY_REASONS,
    GET_INVESTIGATION_COMPLEXITY_REASON_ID,
    TRACKING_SUB_REASONS_BY_REASON_ID,
    GET_IDENTIFICATION_TYPES
} from '../../DBService/InvestigationInfo/Query';
import {
    UPDATE_INVESTIGATION_STATUS,
    UPDATE_INVESTIGATION_START_TIME,
    UPDATE_INVESTIGATION_END_TIME,
    COMMENT,
    UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA,
    UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA,
    CLOSE_ISOLATED_CONTACT,
    UPDATE_INVESTIGATION_COMPLEXITY_REASON_ID,
    DELETE_INVESTIGATION_COMPLEXITY_REASON_ID,
    UPDATE_INVESTIGATION_STATIC_INFO,
    UPDATE_INVESTIGATION_TRACKING
} from '../../DBService/InvestigationInfo/Mutation';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import { GET_INVESTIGATED_PATIENT_RESORTS_DATA } from '../../DBService/InvestigationInfo/Query';
import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';

const investigationInfo = Router();

const convertInvestigationInfoFromDB = (investigationInfo: any) => {
    const investigationPatient = investigationInfo.investigatedPatientByInvestigatedPatientId;

    const convertedCovidPatient = {
        ...investigationPatient,
        ...investigationPatient.covidPatientByCovidPatient,
        age: getPatientAge(investigationPatient.covidPatientByCovidPatient.birthDate)
    }
    delete convertedCovidPatient.covidPatientByCovidPatient;

    const convertedInvestigation = {
        ...investigationInfo,
        ...investigationInfo.investigationPatient,
        ...convertedCovidPatient,
    }
    delete convertedInvestigation.investigatedPatientByInvestigatedPatientId;

    return convertedInvestigation;
};

investigationInfo.get('/staticInfo', handleInvestigationRequest,(request: Request, response: Response) => {
    const staticInfoLogger = logger.setup({
        workflow: 'query investigation static info',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {investigationId: parseInt(response.locals.epidemiologynumber)};
    staticInfoLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, parameters)
        .then(result => {
            staticInfoLogger.info(validDBResponseLog, Severity.LOW);
            const investigationInfo = result.data.investigationByEpidemiologyNumber;
            response.send(convertInvestigationInfoFromDB(investigationInfo));
        }).catch((error) => {
            staticInfoLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.post('/comment', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const updateCommentLogger = logger.setup({
        workflow: 'comment on investigation',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });

    const parameters = { 
        comment: request.body.comment, 
        epidemiologyNumber
    };
    updateCommentLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(COMMENT, response.locals, parameters)
        .then(result => {
            updateCommentLogger.info(validDBResponseLog, Severity.LOW);
            return response.send(result);
        })
        .catch((error) => {
            updateCommentLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.post('/updateInvestigationStatus', handleInvestigationRequest, (request: Request, response: Response) => {
    const { investigationMainStatus, investigationSubStatus, statusReason, epidemiologyNumber } = request.body;
    const logData = {
        workflow: 'update investigation status',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    };
    const updateInvestigationStatusLogger = logger.setup(logData);

    const parameters = {
        epidemiologyNumber,
        investigationStatus: investigationMainStatus,
        investigationSubStatus: investigationSubStatus,
        statusReason: statusReason
    };
    updateInvestigationStatusLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, parameters)
    .then(result => {
        updateInvestigationStatusLogger.info(validDBResponseLog, Severity.LOW);
        if (investigationMainStatus === InvestigationMainStatusCodes.DONE) {
            const closeContactsParameters = {epiNumber: epidemiologyNumber};
            const closeContactsLogger = logger.setup({...logData, workflow: `${logData.workflow}: close open isloated contactes`});
            closeContactsLogger.info(launchingDBRequestLog(closeContactsParameters), Severity.LOW);
            graphqlRequest(CLOSE_ISOLATED_CONTACT, response.locals, closeContactsParameters).then(() => {
                closeContactsLogger.info(validDBResponseLog, Severity.LOW);
                const updateEndTimeLogger = logger.setup({...logData, workflow: `${logData.workflow}: update end time`});
                const updateEndTimeParameters = {
                    epidemiologyNumber,
                    investigationEndTime: new Date()
                }
                updateEndTimeLogger.info(launchingDBRequestLog(updateEndTimeParameters), Severity.LOW);
                graphqlRequest(UPDATE_INVESTIGATION_END_TIME, response.locals, updateEndTimeParameters)
                .then(result => {
                    updateEndTimeLogger.info(validDBResponseLog, Severity.LOW);
                    response.send(result);
                }).catch(error => {
                    updateEndTimeLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                    response.status(errorStatusCode).send(error);
                });
            })
            .catch(error=> {
                closeContactsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                response.status(errorStatusCode).send(error);
            })     
        } else {
            response.send(result);
        }
    })
    .catch(error => {
        updateInvestigationStatusLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

investigationInfo.post('/updateInvestigationStartTime', handleInvestigationRequest, (request: Request, response: Response) => {
    const { epidemiologyNumber } = request.body;
    const investigationStartTime = new Date();
    const updateInvestigationStartTimeLogger = logger.setup({
        workflow: 'update investigation start time',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });

    const parameters = {
        epidemiologyNumber: parseInt(epidemiologyNumber),
        investigationStartTime
    };
    updateInvestigationStartTimeLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    
    graphqlRequest(UPDATE_INVESTIGATION_START_TIME, response.locals, parameters)
        .then(result => {
            updateInvestigationStartTimeLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            updateInvestigationStartTimeLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.get('/subStatuses/:parentStatus', handleInvestigationRequest, (request: Request, response: Response) => {
    const subStatusesLogger = logger.setup({
        workflow: 'query sub statuses by main status',
    });

    const parameters = {
        parentStatus: parseInt(request.params.parentStatus)
    }
    subStatusesLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_SUB_STATUSES_BY_STATUS, response.locals, parameters)
        .then(result => {
            subStatusesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            subStatusesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.get('/resorts/:id', handleInvestigationRequest, (request: Request, response: Response) => {
    const resortsByIdLogger = logger.setup({
        workflow: 'query investigated patients resorts data',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {id: parseInt(request.params.id)};
    resortsByIdLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(GET_INVESTIGATED_PATIENT_RESORTS_DATA, response.locals, parameters)
        .then((result) => {
            const resortsData = result.data.investigatedPatientById; 
            resortsByIdLogger.info(validDBResponseLog, Severity.LOW);
            response.send(resortsData);
        })
        .catch(error => {
            resortsByIdLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.post('/resorts', handleInvestigationRequest, (request: Request, response: Response) => {
    const resortsLogger = logger.setup({
        workflow: 'saving investigated patients resorts data',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    
    const queryVariables = {...request.body};
    resortsLogger.info(launchingDBRequestLog(queryVariables), Severity.LOW);

    return graphqlRequest(UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA, response.locals, queryVariables)
        .then((result) => {
            resortsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data);
        })
        .catch(error => {
            resortsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/interactionsTabSettings', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const settingsFamilyLogger = logger.setup({
        workflow: `query investigation's interactions tab settings`,
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = {id: epidemiologyNumber};
    settingsFamilyLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, parameters)
        .then(result => {
            settingsFamilyLogger.info('query from db successfully', Severity.LOW);
            response.send(result.data.investigationSettingByEpidemiologyNumber);
        }).catch((error) => {
            settingsFamilyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.post('/investigationSettingsFamily', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const settingsFamilyLogger = logger.setup({
        workflow: 'save investigation settings family data',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });

    const queryVariables = {...request.body , id : epidemiologyNumber};
    settingsFamilyLogger.info(launchingDBRequestLog(queryVariables), Severity.LOW);

    return graphqlRequest(UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, queryVariables)
        .then((result) => {
            settingsFamilyLogger.info('saved to db successfully', Severity.LOW);
            response.send(result.data);
        })
        .catch(error => {
            settingsFamilyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/groupedInvestigationsId', handleInvestigationRequest, (request : Request , response : Response) => {
    const {epidemiologynumber} = response.locals;
    
    const groupedInvestigationsIdLogger = logger.setup({
        workflow: 'save investigation settings family data',
        user: response.locals.user.id,
        investigation: epidemiologynumber,
    });
    const params = {epidemiologynumber : parseInt(epidemiologynumber)};
    groupedInvestigationsIdLogger.info(launchingDBRequestLog(params) , Severity.LOW);

    return graphqlRequest(GROUP_ID_BY_EPIDEMIOLOGY_NUMBER, response.locals, params)
        .then((result) => {
            groupedInvestigationsIdLogger.info('query from db successfully', Severity.LOW);
            response.send(result.data.investigationByEpidemiologyNumber.groupId);
        })
        .catch(error => {
            groupedInvestigationsIdLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/complexityReasons', (request: Request, response: Response) => {
    const investigationComplexityReasonsLogger = logger.setup({
        workflow: 'get all descriptions of investigations complexity reasons',
        user: response.locals.user.id,
    });
    investigationComplexityReasonsLogger.info(launchingDBRequestLog() , Severity.LOW);

    return graphqlRequest(GET_INVESTIGATION_COMPLEXITY_REASONS, response.locals)
    .then((result) => {
        investigationComplexityReasonsLogger.info('query from db successfully', Severity.LOW)
        response.send(result.data.allInvestigationComplexityReasons.nodes);
    })
    .catch(error => {
        investigationComplexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    })
});

investigationInfo.post('/updateComplexityReason', (request: Request, response: Response) => {
    const queryVariables = {epidemiologyNumberInput: request.body.epidemiologyNumberInput, newComplexityReasonId: request.body.newComplexityReasonId};
    const updateInvestigationComplexityReasonsLogger = logger.setup({
        workflow: 'get all descriptions of investigations complexity reasons',
        user: response.locals.user.id,
        investigation: request.body.epidemiologyNumberInput,
    });
    updateInvestigationComplexityReasonsLogger.info(launchingDBRequestLog(queryVariables) , Severity.LOW);
    return graphqlRequest(UPDATE_INVESTIGATION_COMPLEXITY_REASON_ID, response.locals, queryVariables)
        .then((result) => {
            updateInvestigationComplexityReasonsLogger.info('query from db successfully', Severity.LOW)
            response.send(result.data);
        })
        .catch(error => {
            updateInvestigationComplexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.post('/deleteComplexityReason', (request: Request, response: Response) => {
    const queryVariables = {epidemiologyNumberInput: request.body.epidemiologyNumberInput, oldComplexityReasonId: request.body.oldComplexityReasonId};
    const deleteInvestigationComplexityReasonsLogger = logger.setup({
        workflow: 'get all descriptions of investigations complexity reasons',
        user: response.locals.user.id,
        investigation: request.body.epidemiologyNumberInput,
    });
    deleteInvestigationComplexityReasonsLogger.info(launchingDBRequestLog(queryVariables) , Severity.LOW);
    return graphqlRequest(DELETE_INVESTIGATION_COMPLEXITY_REASON_ID, response.locals, queryVariables)
        .then((result) => {
            deleteInvestigationComplexityReasonsLogger.info('query from db successfully', Severity.LOW)
            response.send(result.data);
        })
        .catch(error => {
            deleteInvestigationComplexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/getComplexityReason/:epidemiologyNumber', (request: Request, response: Response) => {
    const queryVariables = { epidemiologyNumber: parseInt(request.params.epidemiologyNumber) }
    const getInvestigationComplexityReasonsLogger = logger.setup({
        workflow: 'get all descriptions of investigations complexity reasons',
        user: response.locals.user.id,
        investigation: request.body.epidemiologyNumberInput,
    });
    getInvestigationComplexityReasonsLogger.info(launchingDBRequestLog(queryVariables) , Severity.LOW);
    return graphqlRequest(GET_INVESTIGATION_COMPLEXITY_REASON_ID, response.locals, queryVariables)
    .then((result) => {
        getInvestigationComplexityReasonsLogger.info('query from db successfully', Severity.LOW)
        response.send(result.data.investigationByEpidemiologyNumber.complexityReasonsId);
    })
    .catch(error => {
        getInvestigationComplexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

investigationInfo.get('/trackingSubReasons/:reasonId', (request: Request, response: Response) => {
    const reasonId = parseInt(request.params.reasonId);
    const trackingSubReasonsLogger = logger.setup({
        workflow: 'get trackingSubReasonBy',
        user: response.locals.user.id,
        investigation: request.body.epidemiologyNumberInput,
    });
    trackingSubReasonsLogger.info(launchingDBRequestLog({reasonId}) , Severity.LOW);
    return graphqlRequest(TRACKING_SUB_REASONS_BY_REASON_ID, response.locals, {reasonId})
    .then((result) => {
        trackingSubReasonsLogger.info('query from db successfully', Severity.LOW)
        response.send(result.data.allTrackingSubReasons.nodes);
    })
    .catch(error => {
        trackingSubReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    })
});

investigationInfo.post('/updateTrackingRecommendation', (request: Request, response: Response) => {
    const {reason} = request.body;
    const subReason = request.body.subReason ?? null;
    const extraInfo = request.body.extraInfo ?? null;

    const parameters = {
        inputEpidemiologyNumber: parseInt(response.locals.epidemiologynumber),
        reason,
        subReason,
        extraInfo
    };

    const updateTrackingRecommendationLogger = logger.setup({
        workflow: 'get trackingSubReasonBy',
        user: response.locals.user.id,
        investigation: request.body.epidemiologyNumberInput,
    });

    updateTrackingRecommendationLogger.info(launchingDBRequestLog({parameters}) , Severity.LOW);
    return graphqlRequest(UPDATE_INVESTIGATION_TRACKING, response.locals, parameters)
    .then(result => {
        updateTrackingRecommendationLogger.info(validDBResponseLog, Severity.LOW);
        return response.send(result);
    })
    .catch((error) => {
        updateTrackingRecommendationLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});


investigationInfo.post('/updateStaticInfo', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const updateStaticInfoLogger = logger.setup({
        workflow: 'updating static info of investigation',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });

    const parameters = { 
        fullNameInput: request.body.data.fullName === '' ? null : request.body.data.fullName,
        identificationTypeInput: request.body.data.identificationType === '' ? null : request.body.data.identificationType,
        identityNumberInput: request.body.data.identityNumber === '' ? null : request.body.data.identityNumber,
        epidemiologyNumberInput: epidemiologyNumber
    };

    updateStaticInfoLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(UPDATE_INVESTIGATION_STATIC_INFO, response.locals, parameters)
        .then(result => {
            updateStaticInfoLogger.info(validDBResponseLog, Severity.LOW);
            return response.send(result);
        })
        .catch((error) => {
            updateStaticInfoLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.get('/identificationTypes', (request: Request, response: Response) => {
    const identificationTypesLogger = logger.setup({
        workflow: 'get all identification types',
        user: response.locals.user.id,
    });
    identificationTypesLogger.info(launchingDBRequestLog() , Severity.LOW);

    return graphqlRequest(GET_IDENTIFICATION_TYPES, response.locals)
    .then((result) => {
        identificationTypesLogger.info('query from db to get identification types went successfully', Severity.LOW)
        response.send(result.data.allIdentificationTypes.nodes);
    })
    .catch(error => {
        identificationTypesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    })
});

export default investigationInfo;