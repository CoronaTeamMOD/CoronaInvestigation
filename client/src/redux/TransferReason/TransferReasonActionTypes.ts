import KeyValuePair from 'models/KeyValuePair';

export const SET_TRANSFER_REASON = 'SET_TRANSFER_REASON';

interface SetTransferReason {
    type: typeof SET_TRANSFER_REASON,
    payload: { transferReason: KeyValuePair[] }
}

export type TransferReasonAction = SetTransferReason;