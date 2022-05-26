import * as actionTypes from './RulesConfigActionTypes';

export const setIfContactsNeedIsolation = (ifContactsNeedIsolation: boolean) => {
    return {
        type: actionTypes.SET_IF_CONTACTS_NEED_ISOLATION,
        payload: { ifContactsNeedIsolation }
    };
}