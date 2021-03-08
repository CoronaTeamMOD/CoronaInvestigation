import District from 'models/District';

import * as Actions from './districtActionTypes';

const initialState: District[] = [];

const districtReducer = (state = initialState, action: Actions.districtAction): District[] => {
    switch (action.type) {
        case Actions.SET_DISTRICTS: return action.payload.districts;
        default: return state;
    };
};

export default districtReducer;