export const SET_EPIDEMIOLOGY_NUM = 'SET_EPIDEMIOLOGY_NUM';
export const SET_CANT_REACH_INVESTIGATED = 'SET_CANT_REACH_INVESTIGATED';
export const SET_INVESTIGATED_PATIENT_ID = 'SET_INVESTIGATED_PATIENT_ID';
export const SET_LAST_OPENED_EPIDEMIOLOGY_NUM = 'SET_LAST_OPENED_EPIDEMIOLOGY_NUM';

interface SetEpidemiologyNum {
    type: typeof SET_EPIDEMIOLOGY_NUM,
    payload: {epidemiologyNumber: number}
}

interface SetCantReachInvestigated {
    type: typeof SET_CANT_REACH_INVESTIGATED,
    payload: {cantReachInvestigated: boolean}
}

interface SetInvestigatedPatientId {
    type: typeof SET_INVESTIGATED_PATIENT_ID,
    payload: {investigatedPatientId: number}
}

interface SetLastOpenedEpidemiologyNum {
    type: typeof SET_LAST_OPENED_EPIDEMIOLOGY_NUM,
    payload: {lastOpenedEpidemiologyNumber: number}
}

export type InvestigationAction = SetEpidemiologyNum | SetCantReachInvestigated | SetInvestigatedPatientId | SetLastOpenedEpidemiologyNum;
