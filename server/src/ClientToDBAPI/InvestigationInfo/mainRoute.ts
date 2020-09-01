import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_INVESTIGATION_INFO } from '../../DBService/InvestigationInfo/Query';

const investigationInfo = Router();

investigationInfo.post('/staticInfo', (request: Request, response: Response) => {
    console.log(request.body)
    graphqlRequest(GET_INVESTIGATION_INFO, { id: request.body.id })
    .then((result: any) => response.send(result));
})

export default investigationInfo;