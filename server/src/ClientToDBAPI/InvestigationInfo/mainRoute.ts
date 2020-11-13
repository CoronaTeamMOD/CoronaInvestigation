import {differenceInYears} from 'date-fns';
import {Router, Request, Response} from 'express';

import logger from '../../Logger/Logger';
import {graphqlRequest} from '../../GraphqlHTTPRequest';
import {Service, Severity} from '../../Models/Logger/types';
import InvestigationMainStatus from '../../Models/InvestigationMainStatus';
import { CHECK_FOR_DUPLICATE_IDS } from '../../DBService/ContactedPeople/Mutation';
import { sendSavedInvestigationToIntegration } from '../../Utils/InterfacesIntegration';
import {GET_INVESTIGATION_INFO, GET_SUB_STATUSES} from '../../DBService/InvestigationInfo/Query';
import {
    UPDATE_INVESTIGATION_STATUS,
    UPDATE_INVESTIGATION_START_TIME,
    UPDATE_INVESTIGATION_END_TIME,
    COMMENT
} from '../../DBService/InvestigationInfo/Mutation';

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
    const baseLog = {
        user: response.locals.user.id,
        investigation: response.locals.epidemiologyNumber,
        workflow: `query investigation staticInfo`,
        service: Service.SERVER,
    };

    logger.info({
        severity: Severity.LOW,
        step: `requesting the graphql API to query investigations staticInfo`,
        ...baseLog
    });

    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, {
        investigationId: +request.query.investigationId
    })
        .then((result: any) => {
            if (result?.data?.investigationByEpidemiologyNumber) {
                const investigationInfo = result.data.investigationByEpidemiologyNumber;
                logger.info({
                    severity: Severity.LOW,
                    step: `query investigations staticInfo successfully`,
                    ...baseLog
                });
                response.send(convertInvestigationInfoFromDB(investigationInfo));
            } else {
                logger.info({
                    severity: Severity.LOW,
                    step: `failed to fetch static info due to ${JSON.stringify(result)}`,
                    ...baseLog
                });
                response.status(errorStatusCode).json({error: 'failed to fetch static info'});
            }
        }).catch((error) => {
        logger.info({
            severity: Severity.LOW,
            step: `failed to fetch static info due to ${error}`,
            ...baseLog
        });
        response.status(errorStatusCode).json({error: 'failed to fetch static info'});
    });
});

investigationInfo.post('/comment', (request: Request, response: Response) => {
    const {comment} = request.body;
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const data = {comment, epidemiologyNumber};
    const info = {
        user: response.locals.user.id,
        investigation: epidemiologyNumber,
        workflow: 'comment on investigation',
        service: Service.SERVER,
    };

    logger.info({
        severity: Severity.LOW,
        step: `requesting the graphql API to update investigation status with parameters ${JSON.stringify(data)}`,
        ...info
    });

    return graphqlRequest(COMMENT, response.locals, data)
        .then((result) => {
            if (result?.errors?.length > 0)
                throw new Error(result.errors[0]);

            logger.info({
                severity: Severity.LOW,
                step: `successfully added comment w/ parameters ${JSON.stringify(data)}`,
                ...info
            });
            return response.sendStatus(200);
        })
        .catch((error) => {
            logger.error({
                severity: Severity.MEDIUM,
                step: `failed to add comment w/ parameters ${JSON.stringify(data)}
                error: ${JSON.stringify(error)}
                `,
                ...info
            });
            return response.sendStatus(500)
        });
});

investigationInfo.post('/updateInvestigationStatus', (request: Request, response: Response) => {
    const {investigationMainStatus, investigationSubStatus, epidemiologyNumber} = request.body;
    const currentWorkflow = investigationMainStatus === InvestigationMainStatus.DONE ? 'Ending Investigation' : 'Investigation click';
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: currentWorkflow,
        step: `requesting the graphql API to update investigation status with parameters ${JSON.stringify({
            epidemiologyNumber,
            status: investigationMainStatus
        })}`,
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    })
    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, {
        epidemiologyNumber,
        investigationStatus: investigationMainStatus,
        investigationSubStatus: investigationSubStatus
    })
        .then((result: any) => {
            if (result?.data && !result.errors) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: currentWorkflow,
                    step: 'the investigation status was updated successfully',
                    user: response.locals.user.id,
                    investigation: epidemiologyNumber
                });
                if (investigationMainStatus === InvestigationMainStatus.DONE) {
                    graphqlRequest(CHECK_FOR_DUPLICATE_IDS, response.locals, { currInvestigationId: epidemiologyNumber}).then((result) => {
                        if(!result?.checkForDuplicateIds?.boolean) {
                            const investigationEndTime = new Date();
                            logger.info({
                                service: Service.SERVER,
                                severity: Severity.LOW,
                                workflow: 'Ending Investigation',
                                step: `launching graphql API request to update end time with parameters: ${JSON.stringify({
                                    epidemiologyNumber,
                                    investigationEndTime
                                })}`,
                                user: response.locals.user.id,
                                investigation: epidemiologyNumber
                            });
                            graphqlRequest(UPDATE_INVESTIGATION_END_TIME, response.locals, {
                                epidemiologyNumber,
                                investigationEndTime
                            })
                            .then(() => {
                                logger.info({
                                    service: Service.SERVER,
                                    severity: Severity.LOW,
                                    workflow: 'Ending Investigation',
                                    step: 'got respond from the DB in the request to update end time',
                                    user: response.locals.user.id,
                                    investigation: epidemiologyNumber
                                });
                                response.send({message: 'updated the investigation status and end time successfully'});
                            }).catch(err => {
                                logger.error({
                                    service: Service.SERVER,
                                    severity: Severity.HIGH,
                                    workflow: 'Ending Investigation',
                                    step: `failed to update the investigation end time due to: ${err}`,
                                    user: response.locals.user.id,
                                    investigation: epidemiologyNumber
                                });
                                response.status(errorStatusCode).json({message: 'failed to update the investigation end time'});
                            });
                        } else {
                            response.status(errorStatusCode).json({message: 'found duplicate ids'});
                        }
                    })
                } else {
                    response.send({message: 'updated the investigation status successfully'});
                }
            } else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: currentWorkflow,
                    step: `failed to update investigation status due to: ${JSON.stringify(result)}`,
                    user: response.locals.user.id,
                    investigation: epidemiologyNumber
                });
                response.status(errorStatusCode).json({message: 'failed to update investigation status'});
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: currentWorkflow,
                step: `failed to update investigation status due to: ${err}`,
                user: response.locals.user.id,
                investigation: epidemiologyNumber
            });
            response.status(errorStatusCode).json({message: 'failed to update investigation status'});
        });
})

investigationInfo.post('/updateInvestigationStartTime', (request: Request, response: Response) => {
    const {epidemiologyNumber, investigationStartTime} = request.body;
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Investigation click',
        step: `requesting the graphql API to update investigation start time with parameters ${JSON.stringify({
            epidemiologyNumber,
            investigationStartTime
        })}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologyNumber
    })
    graphqlRequest(UPDATE_INVESTIGATION_START_TIME, response.locals, {
        epidemiologyNumber: +epidemiologyNumber,
        investigationStartTime
    })
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Investigation click',
                step: 'the investigation start time was updated successfully',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologyNumber
            });
            response.send(result)
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Investigation click',
                step: `the investigation start time failed to update due to: ${err}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologyNumber
            });
        });
});

investigationInfo.get('/subStatuses', (request: Request, response: Response) => {
    graphqlRequest(GET_SUB_STATUSES, response.locals, {
        investigationGroupId: +response.locals.user.group,
        orderBy: request.query.orderBy
    })
        .then((result: any) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'GraphQL GET subStatuses request to the DB',
                step: 'graphqlResult THEN succsses'
            });

            response.send(result)
        })
        .catch((err: any) => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'GraphQL GET subStatuses request to the DB',
                step: `graphqlResult CATCH fail ${err}`
            });
            response.status(errorStatusCode).send('error in fetching data: ' + err)
        });
});

export default investigationInfo;