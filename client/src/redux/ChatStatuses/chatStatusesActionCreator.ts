import KeyValuePair from 'models/KeyValuePair';
import * as actionTypes from './chatStatusesActionTypes';


export const setChatStatuses = (chatStatuses: KeyValuePair[]) => {
    return {
        type: actionTypes.SET_CHAT_STATUSES,
        payload: { chatStatuses }
    };
}
