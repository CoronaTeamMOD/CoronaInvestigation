import Country from 'models/Country';

import * as Actions from './countryActionTypes';

const initialState: Map<string, Country> = new Map();

const cityReducer = (state = initialState, action: Actions.countryAction): Map<string, Country> => {
    switch (action.type) {
        case Actions.SET_COUNTRIES: {
            return action.payload.countries
        }
          
        default: return state;
    }
}

export default cityReducer;
