import {store} from '../store';
import * as actionTypes from './investigationActionTypes';

export const setCantReachInvestigated = (cantReachInvestigated : boolean): void => {
    store.dispatch({
        type: actionTypes.SET_CANT_REACH_INVESTIGATED,
        payload: {cantReachInvestigated}
    })
};

export const setInvestigatedPatientId = (investigatedPatientId: number) => {
    store.dispatch({
        type: actionTypes.SET_INVESTIGATED_PATIENT_ID,
        payload: {investigatedPatientId}
    })
};
