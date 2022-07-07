export const SET_IF_CONTACTS_NEED_ISOLATION ='SET_IF_CONTACTS_NEED_ISOLATION';
export const SETTINGS_FOR_STATUS_VALIDITY = 'SETTINGS_FOR_STATUS_VALIDITY';

interface SetIfContactsNeedIsolation {
    type: typeof SET_IF_CONTACTS_NEED_ISOLATION,
    payload:{ ifContactsNeedIsolation: boolean}
}

interface SetSettingsForStatusValidity {
    type: typeof SETTINGS_FOR_STATUS_VALIDITY,
    payload:{ settingsForStatusValidity: JSON}
}

export type rulesConfigAction = SetIfContactsNeedIsolation | SetSettingsForStatusValidity;