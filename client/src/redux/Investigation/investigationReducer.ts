import * as Actions from './investigationActionTypes';
import InvestigationRedux from 'models/InvestigationRedux';

const initialState: InvestigationRedux = {
    epidemiologyNumber: -1,
    cantReachInvestigated: false,
    investigatedPatientId: -1,
    creator: '',
    lastUpdator: '',
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_CANT_REACH_INVESTIGATED: return {...state, cantReachInvestigated: action.payload.cantReachInvestigated}
        case Actions.SET_INVESTIGATED_PATIENT_ID: return {...state, investigatedPatientId: action.payload.investigatedPatientId}

        default: return state;
    }
}

export default investigationReducer;
