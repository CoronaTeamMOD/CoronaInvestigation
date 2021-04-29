import axios from 'axios'
import React from 'react'

import logger from 'logger/logger';
import { Severity } from 'models/Logger';

const UseFlightForm = (props: Props) => {
    const { setFlights } = props;

    const fetchFlightsByAirlineID = async (airlineId : number) => {
        const fetchFlightsByAirlineIDLogger = logger.setup('fetch flights by airline id');

        fetchFlightsByAirlineIDLogger.info('launching db request' , Severity.LOW);
        const flights = await axios.get<string[]>(`/airlines/flights/${airlineId}`)
            .then(result => {
                fetchFlightsByAirlineIDLogger.info('request was successfull' , Severity.LOW);
                return result.data;
            })
            .catch(err => {
                fetchFlightsByAirlineIDLogger.error(`recived error during request, err: ${err}` , Severity.HIGH);
                return [];
            });

        return flights;
    }

    const setFlightsByAirlineID = async (airlineId : number) => {
        const newFlights = await fetchFlightsByAirlineID(airlineId);
        setFlights(newFlights);
    }
    
    return {
        setFlightsByAirlineID
    }
}

interface Props {
    setFlights: React.Dispatch<React.SetStateAction<string[]>>;  
}

export default UseFlightForm;