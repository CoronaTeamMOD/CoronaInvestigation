import InvestigationRedux from 'models/InvestigationRedux';

import * as Actions from './investigationActionTypes';

const initialState: InvestigationRedux = {
    epidemiologyNumber: -1,
    cantReachInvestigated: false,
    investigatedPatientId: -1,
    creator: '',
    lastUpdator: '',
    axiosInterceptorId: -1
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return { ...state, epidemiologyNumber: action.payload.epidemiologyNumber }
        case Actions.SET_CANT_REACH_INVESTIGATED: return { ...state, cantReachInvestigated: action.payload.cantReachInvestigated }
        case Actions.SET_INVESTIGATED_PATIENT_ID: return { ...state, investigatedPatientId: action.payload.investigatedPatientId }
        case Actions.SET_AXIOS_INTERCEPTOR_ID: return { ...state, axiosInterceptorId: action.payload.axiosInterceptorId }

        default: return state;
    }
}

export default investigationReducer;
