export const SET_IF_CONTACTS_NEED_ISOLATION ='SET_IF_CONTACTS_NEED_ISOLATION';
export const SET_IF_INVESTIGATED_PATIENT_NEEDS_ISOLATION = 'SET_IF_INVESTIGATED_PATIENT_NEEDS_ISOLATION';

interface SetIfContactsNeedIsolation {
    type: typeof SET_IF_CONTACTS_NEED_ISOLATION,
    payload:{ ifContactsNeedIsolation: boolean }
}

interface SetIfInvestigatedPatientNeedIsolation {
    type: typeof SET_IF_INVESTIGATED_PATIENT_NEEDS_ISOLATION,
    payload: { ifInvestigatedPatientNeedsIsolation: boolean }
}

export type rulesConfigAction = SetIfContactsNeedIsolation | SetIfInvestigatedPatientNeedIsolation;