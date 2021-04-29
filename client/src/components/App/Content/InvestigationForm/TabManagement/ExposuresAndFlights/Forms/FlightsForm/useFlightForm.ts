import axios from 'axios'
import React from 'react'

const UseFlightForm = (props: Props) => {
    const { setFlights } = props;

    const fetchFlightsByAirlineID = async (airlineId : number) => {
        const flights = await axios.get<string[]>(`/airlines/flights/${airlineId}`)
            .then(result => {
                console.log(result.data);

                return result.data;
            })
            .catch(err => {
                // loggeer
                console.log(err)
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