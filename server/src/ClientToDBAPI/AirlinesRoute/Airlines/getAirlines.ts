import { Request, Response } from 'express';
import { ALL_AIRLINES } from '../../../DBService/Airlines/Query';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';

const getAirlines = (req : Request , res : Response) => {
    //logger
    
    graphqlRequest(ALL_AIRLINES, res.locals)
        .then((result: any) => {
            // loggeerr
            const data = result.data.allAirlines.nodes;
            res.send(data);
        })
        .catch(error => {
            //loggeer
            res.status(errorStatusCode).send(error);
        });
}

export default getAirlines;