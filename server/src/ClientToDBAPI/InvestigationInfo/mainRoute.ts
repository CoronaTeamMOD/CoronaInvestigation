import { differenceInYears } from 'date-fns';
import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Severity } from '../../Models/Logger/types';
import InvestigationMainStatus from '../../Models/InvestigationMainStatus';
import { GET_INVESTIGAION_SETTINGS_FAMILY_DATA, GET_INVESTIGATION_INFO, GET_SUB_STATUSES_BY_STATUS } from '../../DBService/InvestigationInfo/Query';
import {
    UPDATE_INVESTIGATION_STATUS,
    UPDATE_INVESTIGATION_START_TIME,
    UPDATE_INVESTIGATION_END_TIME,
    COMMENT,
    UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA,
    UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA
} from '../../DBService/InvestigationInfo/Mutation';
import { GET_INVESTIGATED_PATIENT_RESORTS_DATA } from '../../DBService/InvestigationInfo/Query';
import { adminMiddleWare } from '../../middlewares/Authentication';

const errorStatusCode = 500;

const investigationInfo = Router();

const getPatientAge = (birthDate: Date): number => {
    if (birthDate) return differenceInYears(new Date(), new Date(birthDate));
    return null;
}

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

investigationInfo.get('/staticInfo', (request: Request, response: Response) => {
    const staticInfoLogger = logger.setup({
        workflow: 'query investigation staticInfo',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    staticInfoLogger.info('requesting the graphql API to query investigations staticInfo', Severity.LOW);

    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, {
        investigationId: +request.query.investigationId
    })
        .then((result: any) => {
            if (result?.data?.investigationByEpidemiologyNumber) {
                const investigationInfo = result.data.investigationByEpidemiologyNumber;
                staticInfoLogger.info('query investigations staticInfo successfully', Severity.LOW);
                response.send(convertInvestigationInfoFromDB(investigationInfo));
            } else {
                staticInfoLogger.error(`failed to fetch static info due to ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(errorStatusCode).json({ error: 'failed to fetch static info' });
            }
        }).catch((error) => {
            staticInfoLogger.error(`failed to fetch static info due to ${error}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'failed to fetch static info' });
        });
});

investigationInfo.get('/groupedInvestigations/reasons', adminMiddleWare,  (request: Request, response: Response) => {
    const reasonsLogger = logger.setup({
        workflow: 'query reasons for grouped investigations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    reasonsLogger.info('requesting the graphql API to query reasons', Severity.LOW);
    const reasons = [
        {
            id: 100000000,
            displayName: 'בני משפחה (מגורים משותפים)'
        },
        {
            id: 100000001,
            displayName: 'טלפון זהה'
        },
        {
            id: 100000002,
            displayName: 'שייכות למוסד משותף'
        },
        {
            id: 100000004,
            displayName: 'אחר'
        }
    ]
    reasonsLogger.info('query reasons successfully', Severity.LOW);
    response.send(reasons);
});

investigationInfo.post('/comment', (request: Request, response: Response) => {
    const { comment } = request.body;
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const data = { comment, epidemiologyNumber };
    const staticInfoLogger = logger.setup({
        workflow: 'comment on investigation',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });
    staticInfoLogger.info(`requesting the graphql API to update investigation status with parameters ${JSON.stringify(data)}`, Severity.LOW);

    return graphqlRequest(COMMENT, response.locals, data)
        .then((result) => {
            if (result?.errors?.length > 0)
                throw new Error(result.errors[0]);
            
            staticInfoLogger.info(`successfully added comment w/ parameters ${JSON.stringify(data)}`, Severity.LOW);
            return response.sendStatus(200);
        })
        .catch((error) => {
            staticInfoLogger.error(`failed to add comment w/ parameters ${JSON.stringify(data)}
            error: ${JSON.stringify(error)}`, Severity.MEDIUM);
            return response.sendStatus(500)
        });
});

investigationInfo.post('/updateInvestigationStatus', (request: Request, response: Response) => {
    const { investigationMainStatus, investigationSubStatus, statusReason, epidemiologyNumber } = request.body;
    const currentWorkflow = investigationMainStatus === InvestigationMainStatus.DONE ? 'Ending Investigation' : 'Investigation click';
    const updateInvestigationStatusLogger = logger.setup({
        workflow: currentWorkflow,
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });
    updateInvestigationStatusLogger.info(`requesting the graphql API to update investigation status with parameters ${JSON.stringify({
        epidemiologyNumber,
        status: investigationMainStatus
    })}`, Severity.LOW);
    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, {
        epidemiologyNumber,
        investigationStatus: investigationMainStatus,
        investigationSubStatus: investigationSubStatus,
        statusReason: statusReason
    })
        .then((result: any) => {
            if (result?.data && !result.errors) {
                updateInvestigationStatusLogger.info('the investigation status was updated successfully', Severity.LOW);
                if (investigationMainStatus === InvestigationMainStatus.DONE) {
                            const investigationEndTime = new Date();
                            updateInvestigationStatusLogger.info(`launching graphql API request to update end time with parameters: ${JSON.stringify({
                                epidemiologyNumber,
                                investigationEndTime
                            })}`, Severity.LOW);
                            graphqlRequest(UPDATE_INVESTIGATION_END_TIME, response.locals, {
                                epidemiologyNumber,
                                investigationEndTime
                            })
                                .then(() => {
                                    updateInvestigationStatusLogger.info('got respond from the DB in the request to update end time', Severity.LOW);
                                    response.send({ message: 'updated the investigation status and end time successfully' });
                                }).catch(err => {
                                    updateInvestigationStatusLogger.error(`failed to update the investigation end time due to: ${err}`, Severity.HIGH);
                                    response.status(errorStatusCode).json({ message: 'failed to update the investigation end time' });
                                });
                       
                } else {
                    response.send({ message: 'updated the investigation status successfully' });
                }
            } else {
                updateInvestigationStatusLogger.error(`failed to update investigation status due to: ${JSON.stringify(result)}`, Severity.HIGH);
                response.status(errorStatusCode).json({ message: 'failed to update investigation status' });
            }
        })
        .catch(err => {
            updateInvestigationStatusLogger.error(`failed to update investigation status due to: ${err}`, Severity.HIGH);
            response.status(errorStatusCode).json({ message: 'failed to update investigation status' });
        });
});

investigationInfo.post('/updateInvestigationStartTime', (request: Request, response: Response) => {
    const { epidemiologyNumber } = request.body;
    const investigationStartTime = new Date();
 
    const updateInvestigationStartTimeLogger = logger.setup({
        workflow: 'Investigation click',
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
    });
    updateInvestigationStartTimeLogger.info(`requesting the graphql API to update investigation start time with parameters ${JSON.stringify({
        epidemiologyNumber,
        investigationStartTime
    })}`, Severity.LOW);
    
    graphqlRequest(UPDATE_INVESTIGATION_START_TIME, response.locals, {
        epidemiologyNumber: +epidemiologyNumber,
        investigationStartTime
    })
        .then((result: any) => {
            updateInvestigationStartTimeLogger.info('the investigation start time was updated successfully', Severity.LOW);
            response.send(result)
        })
        .catch(err => {
            updateInvestigationStartTimeLogger.error(`the investigation start time failed to update due to: ${err}`, Severity.HIGH);
        });
});

investigationInfo.get('/subStatuses/:parentStatus', (request: Request, response: Response) => {
    const subStatusesLogger = logger.setup({
        workflow: 'GraphQL GET subStatuses request to the DB',
    });
    graphqlRequest(GET_SUB_STATUSES_BY_STATUS, response.locals, {
        parentStatus: request.params.parentStatus
    })
        .then((result: any) => {
            subStatusesLogger.info('GraphQL GET subStatuses request to the DB', Severity.LOW);
            response.send(result)
        })
        .catch((err: any) => {
            subStatusesLogger.error(`graphqlResult CATCH fail ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(`error in fetching data: ${err}`)
        });
});

investigationInfo.get('/resorts/:id', (request: Request, response: Response) => {
    const workflow = 'Query investigated patients resorts data';
    const resortsByIdLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    resortsByIdLogger.info('launching get investigated patients resorts data', Severity.LOW);
    return graphqlRequest(GET_INVESTIGATED_PATIENT_RESORTS_DATA, response.locals, {id: +request.params.id})
        .then((result) => {
            const resortsData = result?.data?.investigatedPatientById; 
            if (resortsData) {
                resortsByIdLogger.info('queried investigated patients resorts data successfully', Severity.LOW);
                response.send(resortsData);
            } else {
                const errorMessage : string | undefined = result?.errors[0]?.message;
                let step = 'error in requesting graphql API request in GET_INVESTIGATED_PATIENT_RESORTS_DATA request';
                if (errorMessage) {
                    step = ' due to ' + errorMessage;
                }
                resortsByIdLogger.error(step, Severity.HIGH);
                response.status(errorStatusCode).send(errorMessage);
            }
        })
        .catch(error => {
            resortsByIdLogger.error('error in requesting graphql API request in GET_INVESTIGATED_PATIENT_RESORTS_DATA request', Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.post('/resorts', (request: Request, response: Response) => {
    const workflow = 'Save investigated patients resorts data';
    const resortsLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    resortsLogger.info('launching get investigated patients resorts data', Severity.LOW);

    const queryVariables = {...request.body};

    return graphqlRequest(UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA, response.locals, queryVariables)
        .then((result) => {
            if (result?.data && !result?.errors) {
                resortsLogger.info('saved investigated patients resorts data successfully', Severity.LOW);
                response.send(result?.data);
            } else {
                const errorMessage : string | undefined = result?.errors[0]?.message;
                let step = 'error in requesting graphql API request in GET_INVESTIGATED_PATIENT_RESORTS_DATA request';
                if (errorMessage) {
                    step = ' due to ' + errorMessage;
                }
                resortsLogger.error(step, Severity.HIGH);
                response.status(errorStatusCode).send(errorMessage);
            }
        })
        .catch(error => {
            resortsLogger.error('error in requesting graphql API request in GET_INVESTIGATED_PATIENT_RESORTS_DATA request', Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

investigationInfo.get('/interactionsTabSettings/:id', (request: Request, response: Response) => {
    const settingsFamilyLogger = logger.setup({
        workflow: 'query investigation us family data',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    settingsFamilyLogger.info('requesting the graphql API to query data', Severity.LOW);

    graphqlRequest(GET_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, {id: +request.params.id})
        .then((result: any) => {
            const recievedSettingsData = result?.data?.investigationSettingByEpidemiologyNumber;
            if (recievedSettingsData) {
                settingsFamilyLogger.info('query from db successfully', Severity.LOW);
                response.send(recievedSettingsData);
            } else {
                const errorMessage : string | undefined = result?.errors[0]?.message;
                let step = 'error in requesting graphql API request';
                if (errorMessage) {
                    step = ' due to ' + errorMessage;
                }
                settingsFamilyLogger.error(step, Severity.HIGH);
                response.status(errorStatusCode).send(errorMessage);
            }
        }).catch((error) => {
            settingsFamilyLogger.error(`error in requesting graphql API request due to ${error}`, Severity.HIGH);
            response.status(errorStatusCode).json({ error: 'error in requesting graphql API request' });
        });
});

investigationInfo.post('/investigationSettingsFamily', (request: Request, response: Response) => {
    const workflow = 'Save investigaion settings family data';
    const settingsFamilyLogger = logger.setup({
        workflow,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    settingsFamilyLogger.info('launching get investigated patients resorts data', Severity.LOW);

    const queryVariables = {...request.body};

    return graphqlRequest(UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA, response.locals, queryVariables)
        .then((result) => {
            if (result?.data && !result?.errors) {
                settingsFamilyLogger.info('saved to db successfully', Severity.LOW);
                response.send(result?.data);
            } else {
                const errorMessage : string | undefined = result?.errors[0]?.message;
                let step = 'error in requesting graphql API request';
                if (errorMessage) {
                    step = ' due to ' + errorMessage;
                }
                settingsFamilyLogger.error(step, Severity.HIGH);
                response.status(errorStatusCode).send(errorMessage);
            }
        })
        .catch(error => {
            settingsFamilyLogger.error('error in requesting graphql API request', Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
});

export default investigationInfo;
