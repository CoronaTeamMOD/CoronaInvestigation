import * as Actions from './airlineActionTypes';

const initialState: Map<number, string> = new Map();

const cityReducer = (state = initialState, action: Actions.airlinesAction) : Map<number, string> => {
    switch (action.type) {
        case Actions.SET_AIRLINES: {
            return action.payload.airlines
        }
          
        default:  return state;
    }
}

export default cityReducer;
