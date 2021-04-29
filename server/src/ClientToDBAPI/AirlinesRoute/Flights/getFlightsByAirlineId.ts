import { Request, Response } from 'express';

import { Severity } from '../../../Models/Logger/types';
import { FLIGHTS_BY_AIRLINE_ID } from '../../../DBService/Airlines/Query';
import { errorStatusCode, graphqlRequest } from '../../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../../Logger/Logger';

const getFlightsByAirlineId = (req : Request , res : Response) => {
    const flightsByAirlineIdLogger = logger.setup({
        workflow: 'flights by airline id',
        investigation: res.locals.epidemiologynumber,
        user: res.locals.user.id
    });

    flightsByAirlineIdLogger.info(launchingDBRequestLog(), Severity.LOW);
    const airlineId = parseInt(req.params.airlineId);
    graphqlRequest(FLIGHTS_BY_AIRLINE_ID, res.locals , { airlineId })
        .then((result: any) => {
            flightsByAirlineIdLogger.info(validDBResponseLog, Severity.LOW);

            const data : ServerResponse[] = result.data.allFlightNumbers.nodes;
            res.send(formatServerResponse(data));
        })
        .catch(error => {
            flightsByAirlineIdLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            res.status(errorStatusCode).send(error);
        });
};

const formatServerResponse = (data : ServerResponse[]) => {
    return data.map(
        flight  => flight.displayName
    );
};

interface ServerResponse {
    displayName : string;
};

export default getFlightsByAirlineId;