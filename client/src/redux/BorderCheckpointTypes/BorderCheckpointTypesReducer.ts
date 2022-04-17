import KeyValuePair from 'models/KeyValuePair';
import * as Actions from './BorderCheckpointTypesActionTypes';

const initialState: KeyValuePair[] = [];

const borderCheckpointTypesReducer = (state = initialState, action: Actions.BorderCheckpointTypesAction) => {
    switch (action.type) {
        case Actions.SET_BORDER_CHECKPOINT_TYPES:
            return action.payload.borderCheckpointTypes;
        default:
            return state;
    };
};

export default borderCheckpointTypesReducer;