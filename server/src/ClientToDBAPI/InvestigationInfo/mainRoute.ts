import { differenceInYears } from 'date-fns';
import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { GET_INVESTIGATION_INFO, GET_SUB_STATUSES } from '../../DBService/InvestigationInfo/Query';
import { UPDATE_INVESTIGATION_STATUS, UPDATE_INVESTIGATION_START_TIME, UPDATE_INVESTIGATION_END_TIME } from '../../DBService/InvestigationInfo/Mutation';

const errorStatusCode = 500;

const investigationInfo = Router();

const getPatientAge = (birthDate: Date) : number => {
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
    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, {
        investigationId: +request.query.investigationId
    })
    .then((result: any) => {
        if (result?.data?.investigationByEpidemiologyNumber) {
            const investigationInfo = result.data.investigationByEpidemiologyNumber;
            response.send(convertInvestigationInfoFromDB(investigationInfo));
        } else {
            response.status(errorStatusCode).json({error: 'failed to fetch static info'});
        }
    });
})

investigationInfo.post('/updateInvestigationStatus', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationMainStatus, investigationSubStatus } = request.body;
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Investigation click',
        step: `requesting the graphql API to update investigation status with parameters ${JSON.stringify({ epidemiologyNumber, investigationMainStatus })}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologyNumber
    })
    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationStatus: investigationMainStatus, investigationSubStatus })
    .then((result: any) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Investigation click',
            step: 'the investigation status was updated successfully',
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
            step: `the investigation status failed to update due to: ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologyNumber
        });
    });
})

investigationInfo.post('/updateInvestigationStartTime', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationStartTime } = request.body;
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Investigation click',
        step: `requesting the graphql API to update investigation start time with parameters ${JSON.stringify({ epidemiologyNumber, investigationStartTime })}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologyNumber
    })
    graphqlRequest(UPDATE_INVESTIGATION_START_TIME, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationStartTime })
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
})

investigationInfo.post('/updateInvestigationEndTime', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationEndTime } = request.body;
    graphqlRequest(UPDATE_INVESTIGATION_END_TIME, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationEndTime: new Date() })
    .then((result: any) => response.send(result));
})

investigationInfo.get('/subStatuses', (request: Request, response: Response) => {
    graphqlRequest(GET_SUB_STATUSES, response.locals, { investigationGroupId: +response.locals.user.group, orderBy: request.query.orderBy  })
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
                severity: Severity.LOW,
                workflow: 'GraphQL GET subStatuses request to the DB',
                step: `graphqlResult CATCH fail ${err}`
            });
            response.status(errorStatusCode).send('error in fetching data: ' + err)
        });
});


export default investigationInfo;