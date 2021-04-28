import { Request, Response } from 'express';
import { FLIGHTS_BY_AIRLINE_ID } from '../../../DBService/Airlines/Query';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';

const getFlightsByAirlineId = (req : Request , res : Response) => {
    //logger
    const airlineId = parseInt(req.params.airlineId);
    graphqlRequest(FLIGHTS_BY_AIRLINE_ID, res.locals , { airlineId })
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

export default getFlightsByAirlineId;