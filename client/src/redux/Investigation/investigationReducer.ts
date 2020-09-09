import * as Actions from './investigationActionTypes';
import InvestigationRedux from 'models/InvestigationRedux';

const initialState: InvestigationRedux = {
    epidemiologyNumber: 133,
    cantReachInvestigated: false,
    investigatedPatientId: 41,
    creator: '33',
    lastUpdator: '33',
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return {...state, epidemiologyNumber: action.payload.epidemiologyNumber}
        case Actions.SET_CANT_REACH_INVESTIGATED: return {...state, cantReachInvestigated: action.payload.cantReachInvestigated}
        case Actions.SET_INVESTIGATED_PATIENT_ID: return {...state, investigatedPatientId: action.payload.investigatedPatientId}
        case Actions.SET_CREATOR: return {...state, creator: action.payload.creator}
        case Actions.SET_LAST_UPDATOR: return {...state, lastUpdator: action.payload.lastUpdator}

        default: return state;
    }
}

export default investigationReducer;
