import { defaultEpidemiologyNumber } from 'Utils/consts';
import InvestigationRedux from 'models/InvestigationRedux';

import * as Actions from './investigationActionTypes';

const initialState: InvestigationRedux = {
    epidemiologyNumber: defaultEpidemiologyNumber,
    investigationStatus: {
        mainStatus: '',
        subStatus: ''
    },
    investigatedPatientId: -1,
    creator: '',
    lastUpdator: '',
    lastOpenedEpidemiologyNumber: defaultEpidemiologyNumber,
    isCurrentlyLoading: false,
    axiosInterceptorId: -1,
    validationDate: new Date()
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return { ...state, epidemiologyNumber: action.payload.epidemiologyNumber }
        case Actions.SET_INVESTIGATED_PATIENT_ID: return { ...state, investigatedPatientId: action.payload.investigatedPatientId }
        case Actions.SET_AXIOS_INTERCEPTOR_ID: return { ...state, axiosInterceptorId: action.payload.axiosInterceptorId }
        case Actions.SET_IS_CURRENTLY_LOADING: return {...state, isCurrentlyLoading: action.payload.isCurrentlyLoading}
        case Actions.SET_LAST_OPENED_EPIDEMIOLOGY_NUM: return {...state, lastOpenedEpidemiologyNumber: action.payload.lastOpenedEpidemiologyNumber}
        case Actions.SET_INVESTIGATION_STATUS: return { ...state, investigationStatus: action.payload.investigationStatus }
        case Actions.SET_VALIDATION_DATE: return { ...state, validationDate: action.payload.validationDate }
        default: return state;
    }
}

export default investigationReducer;
