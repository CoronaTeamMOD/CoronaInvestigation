import KeyValuePair from 'models/KeyValuePair';
import * as Actions from './investigatorReferenceStatusesActionTypes';

const initialState: KeyValuePair[] = [];

const investigatorReferenceStatusesReducer = (state = initialState, action: Actions.InvestigatorReferenceStatusesAction) => {
    switch (action.type) {
        case Actions.SET_INVESTIGATOR_REFERENCE_STATUSES:
            return action.payload.investigatorReferenceStatuses;
        default:
            return state;
    };
};

export default investigatorReferenceStatusesReducer;