import * as actionTypes from './RulesConfigActionTypes';

export const setIfContactsNeedIsolation = (ifContactsNeedIsolation: boolean) => {
    return {
        type: actionTypes.SET_IF_CONTACTS_NEED_ISOLATION,
        payload: { ifContactsNeedIsolation }
    };
}

export const setIfInvestigatedPatientNeedsIsolation = (ifInvestigatedPatientNeedsIsolation: boolean) => {
    return {
        type: actionTypes.SET_IF_INVESTIGATED_PATIENT_NEEDS_ISOLATION,
        payload: { ifInvestigatedPatientNeedsIsolation }
    };
}