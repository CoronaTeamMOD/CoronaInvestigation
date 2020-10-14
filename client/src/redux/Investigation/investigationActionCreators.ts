import { InvestigationStatus } from 'models/InvestigationStatus';

import { store } from '../store';
import * as actionTypes from './investigationActionTypes';

export const setEpidemiologyNum = (epidemiologyNumber: number): void => {
    store.dispatch({
        type: actionTypes.SET_EPIDEMIOLOGY_NUM,
        payload: { epidemiologyNumber }
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
