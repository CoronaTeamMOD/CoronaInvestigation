import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_INVESTIGATION_INFO } from '../../DBService/InvestigationInfo/Query';
import { UPDATE_INVESTIGATION_STATUS, UPDATE_INVESTIGATION_START_TIME, UPDATE_INVESTIGATION_END_TIME } from '../../DBService/InvestigationInfo/Mutation';

const investigationInfo = Router();

investigationInfo.get('/staticInfo', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, {
        investigationId: +request.query.investigationId
    })
    .then((result: any) => response.send(result));
})

investigationInfo.post('/updateInvestigationStatus', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationStatus, endTime } = request.body;
    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationStatus, endTime })
    .then((result: any) => response.send(result));
})

investigationInfo.post('/updateInvestigationStartTime', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationStartTime } = request.body;
    graphqlRequest(UPDATE_INVESTIGATION_START_TIME, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationStartTime })
    .then((result: any) => response.send(result));
})

investigationInfo.post('/updateInvestigationEndTime', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationEndTime } = request.body;
    graphqlRequest(UPDATE_INVESTIGATION_END_TIME, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationEndTime })
    .then((result: any) => response.send(result));
})

export default investigationInfo;