export const SET_EPIDEMIOLOGY_NUM = 'SET_EPIDEMIOLOGY_NUM';
export const SET_CANT_REACH_INVESTIGATED = 'SET_CANT_REACH_INVESTIGATED';
export const SET_INVESTIGATED_PATIENT_ID = 'SET_INVESTIGATED_PATIENT_ID';
export const SET_CREATOR = 'SET_CREATOR';
export const SET_LAST_UPDATOR = 'SET_LAST_UPDATOR';

interface SetEpidemiologyNum {
    type: typeof SET_EPIDEMIOLOGY_NUM,
    payload: {epidemiologyNumber: number}
}

interface SetCantReachInvestigated {
    type: typeof SET_CANT_REACH_INVESTIGATED,
    payload: {cantReachInvestigated: boolean}
}

interface SetCreator {
    type: typeof SET_INVESTIGATED_PATIENT_ID,
    payload: {investigatedPatientId: number}
}

interface SetInvestigatedPatientId {
    type: typeof SET_CREATOR,
    payload: {creator: string}
}

interface SetLastUpdator {
    type: typeof SET_LAST_UPDATOR,
    payload: {lastUpdator: string}
}

export type InvestigationAction = SetEpidemiologyNum | SetCantReachInvestigated | SetInvestigatedPatientId | SetCreator | SetLastUpdator;
