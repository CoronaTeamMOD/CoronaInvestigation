import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { getPatientAge } from '../../Utils/patientUtils';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_INVESTIGATED_PATIENT_RESORTS_DATA } from '../../DBService/InvestigationInfo/Query';
import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { GET_INVESTIGATION_INFO, GET_SUB_STATUSES_BY_STATUS, GET_INVESTIGAION_SETTINGS_FAMILY_DATA } from '../../DBService/InvestigationInfo/Query';
import {
    UPDATE_INVESTIGATION_STATUS,
    UPDATE_INVESTIGATION_START_TIME,
    UPDATE_INVESTIGATION_END_TIME,
    COMMENT,
    UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA,
    UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA,
    CLOSE_ISOLATED_CONTACT
} from '../../DBService/InvestigationInfo/Mutation';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import { GET_INVESTIGATED_PATIENT_RESORTS_DATA } from '../../DBService/InvestigationInfo/Query';
import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';

const investigationInfo = Router();

const convertInvestigationInfoFromDB = (investigationInfo: any) => {
    const investigationPatient = investigationInfo.investigatedPatientByInvestigatedPatientId;

    const convertedInvestigationPatient = {
        ...investigationPatient,
        patientInfo: {
            ...investigationPatient.covidPatientByCovidPatient,
            age: getPatientAge(investigationPatient.covidPatientByCovidPatient.birthDate)
        }
    }
    delete convertedInvestigationPatient.covidPatientByCovidPatient;

    const convertedInvestigation = {
        ...investigationInfo,
        investigatedPatient: convertedInvestigationPatient
    }
    delete convertedInvestigation.investigatedPatientByInvestigatedPatientId;

    return convertedInvestigation;
}

investigationInfo.get('/staticInfo', handleInvestigationRequest,(request: Request, response: Response) => {
    const staticInfoLogger = logger.setup({
        workflow: 'query investigation static info',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {investigationId: +request.query.investigationId};
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
    }
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
        epidemiologyNumber: +epidemiologyNumber,
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
        parentStatus: +request.params.parentStatus
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

    const parameters = {id: +request.params.id};
    resortsByIdLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(GET_INVESTIGATED_PATIENT_RESORTS_DATA, response.locals, parameters)
        .then((result) => {
            const resortsData = result?.data?.investigatedPatientById; 
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
            response.send(result?.data);
        })
        .catch(error => {
            resortsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/interactionsTabSettings/:id', handleInvestigationRequest, (request: Request, response: Response) => {
    const settingsFamilyLogger = logger.setup({
        workflow: `query investigation's interactions tab settings`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {id: +request.params.id};
    settingsFamilyLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, parameters)
        .then(result => {
            settingsFamilyLogger.info('query from db successfully', Severity.LOW);
            response.send(result?.data?.investigationSettingByEpidemiologyNumber);
        }).catch((error) => {
            settingsFamilyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
});

investigationInfo.post('/investigationSettingsFamily', handleInvestigationRequest, (request: Request, response: Response) => {
    const settingsFamilyLogger = logger.setup({
        workflow: 'save investigation settings family data',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const queryVariables = {...request.body};
    settingsFamilyLogger.info(launchingDBRequestLog(queryVariables), Severity.LOW);

    return graphqlRequest(UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, queryVariables)
        .then((result) => {
            settingsFamilyLogger.info('saved to db successfully', Severity.LOW);
            response.send(result?.data);
        })
        .catch(error => {
            settingsFamilyLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

export default investigationInfo;
