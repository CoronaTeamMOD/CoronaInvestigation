import Airline from 'models/Airline';

import * as Actions from './airlineActionTypes';

const initialState: Map<string, Airline> = new Map();

const cityReducer = (state = initialState, action: Actions.airlinesAction) : Map<string, Airline> => {
    switch (action.type) {
        case Actions.SET_AIRLINES: {
            return action.payload.airlines
        }
          
        default:  return state;
    }
}

export default cityReducer;
