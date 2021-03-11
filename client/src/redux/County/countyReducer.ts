import CountyReducer from 'models/CountyReducer';

import * as Actions from './countyActionTypes';

const initialState: CountyReducer = {allCounties: [], districtCounties: []};

const countyReducer = (state = initialState, action: Actions.countyAction): CountyReducer => {
    switch (action.type) {
        case Actions.SET_COUNTIES: {
            return {
                allCounties: action.payload.counties,
                districtCounties: action.payload.counties.filter(county => county.district.id === action.payload.userDistrict)
            };
        };
        default: return state;
    };
};

export default countyReducer;