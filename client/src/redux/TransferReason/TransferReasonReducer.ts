import KeyValuePair from 'models/KeyValuePair';
import * as Actions from './TransferReasonActionTypes';

const initialState: KeyValuePair[] = [];

const transferReasonReducer = (state = initialState, action: Actions.TransferReasonAction) => {
    switch (action.type) {
        case Actions.SET_TRANSFER_REASON:
            return action.payload.transferReason;
        default:
            return state;
    };
};

export default transferReasonReducer;