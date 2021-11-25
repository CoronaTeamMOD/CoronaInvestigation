import KeyValuePair from 'models/KeyValuePair';

export const SET_CHAT_STATUSES = 'SET_CHAT_STATUSES';

interface SetChatStatuses {
    type: typeof SET_CHAT_STATUSES,
    payload: { chatStatuses: KeyValuePair[] }
}

export type chatStatusesAction = SetChatStatuses;
