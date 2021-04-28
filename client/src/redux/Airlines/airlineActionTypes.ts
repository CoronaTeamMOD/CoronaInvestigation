import Airline from 'models/Airline';

export const SET_AIRLINES = 'SET_AIRLINES';

interface SetAirlines {
    type: typeof SET_AIRLINES;
    payload: { airlines: Map<string, Airline> };
}

export type airlinesAction = SetAirlines;
