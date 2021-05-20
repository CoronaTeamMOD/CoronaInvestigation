import SubStatus from 'models/SubStatus';

import * as Actions from './subStatusesActionTypes';

const initialState: SubStatus[] = [];

const subStatusesReducer = (state = initialState, action: Actions.SubStatusesAction): SubStatus[] => {
    switch (action.type) {
        case Actions.SET_SUB_STATUSES: 
            return action.payload.subStatuses;
        default: 
            return state;
    };
};

export default subStatusesReducer;