import InvestigationRedux from 'models/InvestigationRedux';

import * as Actions from './investigationActionTypes';

const initialState: InvestigationRedux = {
    epidemiologyNumber: -1,
    cantReachInvestigated: false,
    investigatedPatientId: -1,
    creator: '',
    lastUpdator: '',
    lastOpenedEpidemiologyNumber: -1
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return {...state, epidemiologyNumber: action.payload.epidemiologyNumber}
        case Actions.SET_CANT_REACH_INVESTIGATED: return {...state, cantReachInvestigated: action.payload.cantReachInvestigated}
        case Actions.SET_INVESTIGATED_PATIENT_ID: return {...state, investigatedPatientId: action.payload.investigatedPatientId}
        case Actions.SET_LAST_OPENED_EPIDEMIOLOGY_NUM: return {...state, lastOpenedEpidemiologyNumber: action.payload.lastOpenedEpidemiologyNumber}

        default: return state;
    }
}

export default investigationReducer;
