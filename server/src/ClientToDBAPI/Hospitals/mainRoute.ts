import { Router, Request, Response, NextFunction } from 'express';

import Hospital from '../../Models/Hospital';
import { graphqlRequest } from '../../../src/GraphqlHTTPRequest';
import { getAllHospitals } from '../../DBService/Hospitals/Query';

const router = Router();

type AllHospitalsType = {
    data: {
        allHospitals: {
            nodes: [Hospital]
        }
    }
};

router.get('/', (request: Request, response: Response, next: NextFunction) => {
    graphqlRequest(getAllHospitals, response.locals)
    .then((result: AllHospitalsType) => {
        response.json(result.data.allHospitals.nodes);
    })
});

export default router;