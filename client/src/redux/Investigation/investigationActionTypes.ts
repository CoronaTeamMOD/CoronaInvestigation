export const SET_EPIDEMIOLOGY_NUM = 'SET_EPIDEMIOLOGY_NUM';
export const SET_CANT_REACH_INVESTIGATED = 'SET_CANT_REACH_INVESTIGATED';
export const SET_INVESTIGATED_PATIENT_ID = 'SET_INVESTIGATED_PATIENT_ID';
export const SET_AXIOS_INTERCEPTOR_ID = 'SET_AXIOS_INTERCEPTOR_ID';

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

interface SetAxiosInterceptorId {
    type: typeof SET_AXIOS_INTERCEPTOR_ID,
    payload: {axiosInterceptorId: number}
}

export type InvestigationAction = SetEpidemiologyNum | SetCantReachInvestigated | SetInvestigatedPatientId | SetAxiosInterceptorId;
