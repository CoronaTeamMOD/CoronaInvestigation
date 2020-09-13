import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_INVESTIGATION_INFO } from '../../DBService/InvestigationInfo/Query';
import { UPDATE_INVESTIGATION_STATUS } from '../../DBService/InvestigationInfo/Mutation';

const investigationInfo = Router();

investigationInfo.get('/staticInfo', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATION_INFO, response.locals, {
        investigationId: +request.query.investigationId
    })
    .then((result: any) => response.send(result));
})

investigationInfo.post('/updateInvestigationStatus', (request: Request, response: Response) => {
    const { epidemiologyNumber, investigationStatus } = request.body;
    graphqlRequest(UPDATE_INVESTIGATION_STATUS, response.locals, { epidemiologyNumber: +epidemiologyNumber, investigationStatus })
    .then((result: any) => response.send(result));
})

export default investigationInfo;