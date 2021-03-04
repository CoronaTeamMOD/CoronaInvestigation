import { InvestigationStatus } from 'models/InvestigationStatus';
import SymptomsExistenceInfo from 'models/SymptomsExistenceInfo';

import { store } from '../store';
import * as actionTypes from './investigationActionTypes';

export const setEpidemiologyNum = (epidemiologyNumber: number): void => {
    store.dispatch({
        type: actionTypes.SET_EPIDEMIOLOGY_NUM,
        payload: { epidemiologyNumber }
    })
};

export const setComplexReasonsId = (complexReasonsId: (number|null)[]): void => {
    store.dispatch({
        type: actionTypes.SET_COMPLEX_REASONS_ID,
        payload: { complexReasonsId }
    })
};

export const setAxiosInterceptorId = (axiosInterceptorId: number): void => {
    store.dispatch({
        type: actionTypes.SET_AXIOS_INTERCEPTOR_ID,
        payload: { axiosInterceptorId }
    })
};

export const setInvestigatedPatientId = (investigatedPatientId: number) => {
    store.dispatch({
        type: actionTypes.SET_INVESTIGATED_PATIENT_ID,
        payload: { investigatedPatientId }
    })
};

export const setIsDeceased = (isDeceased: boolean) => {
    store.dispatch({
        type: actionTypes.SET_IS_DECEASED,
        payload: { isDeceased }
    })
};

export const setIsCurrentlyHospitialized = (isCurrentlyHospitialized: boolean) => {
    store.dispatch({
        type: actionTypes.SET_IS_CURRENTLY_HOSPITIALIZED,
        payload: { isCurrentlyHospitialized }
    })
};

export const setLastOpenedEpidemiologyNum = (lastOpenedEpidemiologyNumber : number): void => {
    store.dispatch({
        type: actionTypes.SET_LAST_OPENED_EPIDEMIOLOGY_NUM,
        payload: {lastOpenedEpidemiologyNumber}
    })
};

export const setIsCurrentlyLoading = (isCurrentlyLoading : boolean): void => {
    store.dispatch({
        type: actionTypes.SET_IS_CURRENTLY_LOADING,
        payload: {isCurrentlyLoading}
    })
};

export const setInvestigationStatus = (investigationStatus: InvestigationStatus) => {
    store.dispatch({
        type: actionTypes.SET_INVESTIGATION_STATUS,
        payload: { investigationStatus }
    })
}

export const setEndTime = (endTime: Date | null) => {
    store.dispatch({
        type: actionTypes.SET_END_TIME,
        payload: { endTime }
    })
}

export const setCreator = (creator: string) => {
    store.dispatch({
        type: actionTypes.SET_CREATOR,
        payload: { creator }
    })
}

export const setDatesToInvestigateParams = (symptomsExistenceInfo?: SymptomsExistenceInfo, validationDate?: Date) => {
    store.dispatch({
        type: actionTypes.SET_DATES_TO_INVESTIGATE_PARAMS,
        payload: { symptomsExistenceInfo, validationDate }
    })
};

export const resetInvestigationState = () => {
    store.dispatch({
        type: actionTypes.RESET_STATE,
    })
};
