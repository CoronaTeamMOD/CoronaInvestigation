import {store} from '../store';
import * as actionTypes from './investigationActionTypes';

export const setEpidemiologyNum = (epidemiologyNumber : string): void => {
    store.dispatch({
        type: actionTypes.SET_EPIDEMIOLOGY_NUM,
        payload: {epidemiologyNumber}
    })
}

export const setCantReachInvestigated = (cantReachInvestigated : boolean): void => {
    store.dispatch({
        type: actionTypes.SET_CANT_REACH_INVESTIGATED,
        payload: {cantReachInvestigated}
    })
}