import { InvestigationStatus } from 'models/InvestigationStatus';
import SymptomsExistenceInfo from 'models/SymptomsExistenceInfo';

export const SET_EPIDEMIOLOGY_NUM = 'SET_EPIDEMIOLOGY_NUM';
export const SET_INVESTIGATED_PATIENT_ID = 'SET_INVESTIGATED_PATIENT_ID';
export const SET_IS_DECEASED = 'SET_IS_DECEASED';
export const SET_IS_CURRENTLY_HOSPITIALIZED = 'SET_IS_CURRENTLY_HOSPITIALIZED';
export const SET_LAST_OPENED_EPIDEMIOLOGY_NUM = 'SET_LAST_OPENED_EPIDEMIOLOGY_NUM';
export const SET_IS_CURRENTLY_LOADING = 'SET_IS_CURRENTLY_LOADING';
export const SET_AXIOS_INTERCEPTOR_ID = 'SET_AXIOS_INTERCEPTOR_ID';
export const SET_INVESTIGATION_STATUS = 'SET_INVESTIGATION_STATUS';
export const SET_END_TIME = 'SET_END_TIME';
export const SET_CREATOR = 'SET_CREATOR';
export const SET_DATES_TO_INVESTIGATE_PARAMS = 'SET_DATES_TO_INVESTIGATE_PARAMS';

interface SetEpidemiologyNum {
    type: typeof SET_EPIDEMIOLOGY_NUM,
    payload: {epidemiologyNumber: number}
}

interface SetInvestigatedPatientId {
    type: typeof SET_INVESTIGATED_PATIENT_ID,
    payload: {investigatedPatientId: number}
}

interface SetIsDeceased {
    type: typeof SET_IS_DECEASED,
    payload: {isDeceased: boolean}
}

interface SetIsCurrentlyHospitialized {
    type: typeof SET_IS_CURRENTLY_HOSPITIALIZED,
    payload: {isCurrentlyHospitialized: boolean}
}

interface SetLastOpenedEpidemiologyNum {
    type: typeof SET_LAST_OPENED_EPIDEMIOLOGY_NUM,
    payload: {lastOpenedEpidemiologyNumber: number}
}

interface SetIsCurrentlyLoading {
    type: typeof SET_IS_CURRENTLY_LOADING,
    payload: {isCurrentlyLoading: boolean}
}

interface SetAxiosInterceptorId {
    type: typeof SET_AXIOS_INTERCEPTOR_ID,
    payload: {axiosInterceptorId: number}
}

interface SetInvestigationStatus {
    type: typeof SET_INVESTIGATION_STATUS,
    payload: {investigationStatus: InvestigationStatus}
}

interface SetEndTime {
    type: typeof SET_END_TIME,
    payload: {endTime: Date | null}
}

interface SetCreator {
    type: typeof SET_CREATOR,
    payload: {creator: string}
}

interface SetDatesToInvestigateParams {
    type: typeof SET_DATES_TO_INVESTIGATE_PARAMS,
    payload: {symptomsExistenceInfo?: SymptomsExistenceInfo, validationDate?: Date}
}

export type InvestigationAction = SetEpidemiologyNum | SetInvestigationStatus | SetInvestigatedPatientId | SetAxiosInterceptorId
 | SetLastOpenedEpidemiologyNum | SetIsCurrentlyLoading | SetIsDeceased | SetIsCurrentlyHospitialized | SetEndTime 
 | SetCreator | SetDatesToInvestigateParams;
