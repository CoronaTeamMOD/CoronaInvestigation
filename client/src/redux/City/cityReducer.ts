import City from 'models/City';

import * as Actions from './cityActionTypes';

const initialState: Map<string, City> = new Map();

const cityReducer = (state = initialState, action: Actions.cityAction) : Map<string, City> => {
    switch (action.type) {
        case Actions.SET_CITIES: {
            return action.payload.cities
        }
          
        default:  return state;
    }
}

export default cityReducer;
