export const SET_IF_CONTACTS_NEED_ISOLATION ='SET_IF_CONTACTS_NEED_ISOLATION';

interface SetIfContactsNeedIsolation {
    type: typeof SET_IF_CONTACTS_NEED_ISOLATION,
    payload:{ ifContactsNeedIsolation: boolean}
}

export type rulesConfigAction = SetIfContactsNeedIsolation;