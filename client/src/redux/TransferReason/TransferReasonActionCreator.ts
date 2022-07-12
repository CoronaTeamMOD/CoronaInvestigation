import KeyValuePair from 'models/KeyValuePair';
import * as actionTypes from './TransferReasonActionTypes';

export const SetTransferReason = (transferReason: KeyValuePair[]) => {
    return {
        type: actionTypes.SET_TRANSFER_REASON,
        payload: { transferReason }
    };
}
