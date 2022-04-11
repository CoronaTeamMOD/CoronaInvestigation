import * as Actions from './airlineActionTypes';

const initialState: Map<String, string> = new Map();

const airlineReducer = (state = initialState, action: Actions.airlinesAction) : Map<String, string> => {
    switch (action.type) {
        case Actions.SET_AIRLINES: {
            return action.payload.airlines
        }
          
        default:  return state;
    }
}

export default airlineReducer;
