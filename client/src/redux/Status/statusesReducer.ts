import InvestigationMainStatus from 'models/InvestigationMainStatus';

import * as Actions from './statusesActionTypes';

const initialState: InvestigationMainStatus[] = []

const statusesReducer = (state = initialState, action: Actions.StatusesAction): InvestigationMainStatus[] => {
    switch (action.type) {
        case Actions.SET_STATUSES: return action.payload.statuses

        default: return state;
    }
}

export default statusesReducer;
