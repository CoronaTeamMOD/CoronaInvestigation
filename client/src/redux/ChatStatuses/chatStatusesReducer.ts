import KeyValuePair from 'models/KeyValuePair';
import * as Actions from './chatStatusesActionTypes';

const initialState: KeyValuePair[] = [];

const chatStatusesReducer = (state = initialState, action: Actions.chatStatusesAction) => {
    switch (action.type) {
        case Actions.SET_CHAT_STATUSES:
            return action.payload.chatStatuses;
        default:
            return state;
    };
};

export default chatStatusesReducer;