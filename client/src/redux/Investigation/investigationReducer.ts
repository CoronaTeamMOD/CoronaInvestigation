import { defaultEpidemiologyNumber } from 'Utils/consts';
import InvestigationRedux from 'models/InvestigationRedux';

import * as Actions from './investigationActionTypes';

const initialState: InvestigationRedux = {
    epidemiologyNumber: defaultEpidemiologyNumber,
    cantReachInvestigated: false,
    investigatedPatientId: -1,
    creator: '',
    lastUpdator: '',
    lastOpenedEpidemiologyNumber: defaultEpidemiologyNumber,
    isCurrentlyLoading: false
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return {...state, epidemiologyNumber: action.payload.epidemiologyNumber}
        case Actions.SET_IS_CURRENTLY_LOADING: return {...state, isCurrentlyLoading: action.payload.isCurrentlyLoading}
        case Actions.SET_CANT_REACH_INVESTIGATED: return {...state, cantReachInvestigated: action.payload.cantReachInvestigated}
        case Actions.SET_INVESTIGATED_PATIENT_ID: return {...state, investigatedPatientId: action.payload.investigatedPatientId}
        case Actions.SET_LAST_OPENED_EPIDEMIOLOGY_NUM: return {...state, lastOpenedEpidemiologyNumber: action.payload.lastOpenedEpidemiologyNumber}

        default: return state;
    }
}

export default investigationReducer;
