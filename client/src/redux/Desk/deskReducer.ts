import Desk from 'models/Desk';

import * as Actions from './deskActionTypes';

const initialState: Desk[] = [];

const deskReducer = (state = initialState, action: Actions.deskAction): Desk[] => {
    switch (action.type) {
        case Actions.SET_DESKS: return action.payload.desks;
        default: return state;
    };
};

export default deskReducer;