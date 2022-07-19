import * as actionTypes from './RulesConfigActionTypes';

export const setIfContactsNeedIsolation = (ifContactsNeedIsolation: boolean) => {
    return {
        type: actionTypes.SET_IF_CONTACTS_NEED_ISOLATION,
        payload: { ifContactsNeedIsolation }
    };
}

export const setSettingsForStatusValidity = (settingsForStatusValidity: JSON) => {
    return {
        type: actionTypes.SETTINGS_FOR_STATUS_VALIDITY,
        payload: { settingsForStatusValidity }
    };
}