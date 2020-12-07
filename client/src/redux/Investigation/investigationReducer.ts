import { defaultEpidemiologyNumber } from 'Utils/consts';
import InvestigationRedux from 'models/InvestigationRedux';

import * as Actions from './investigationActionTypes';

const initialState: InvestigationRedux = {
    epidemiologyNumber: defaultEpidemiologyNumber,
    investigationStatus: {
        mainStatus: -1,
        subStatus: '',
        statusReason: ''
    },
    investigatedPatient: {
        investigatedPatientId: -1,
        isDeceased: false,
        isCurrentlyHospitialized: false
    },
    creator: '',
    lastUpdator: '',
    lastOpenedEpidemiologyNumber: defaultEpidemiologyNumber,
    isCurrentlyLoading: false,
    axiosInterceptorId: -1,
    validationDate: new Date(),
    endTime: null
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return { ...state, epidemiologyNumber: action.payload.epidemiologyNumber }
        case Actions.SET_INVESTIGATED_PATIENT_ID: return { ...state, investigatedPatient: { ...state.investigatedPatient, investigatedPatientId: action.payload.investigatedPatientId } }
        case Actions.SET_IS_DECEASED: return { ...state, investigatedPatient: { ...state.investigatedPatient, isDeceased: action.payload.isDeceased } }
        case Actions.SET_IS_CURRENTLY_HOSPITIALIZED: return { ...state, investigatedPatient: { ...state.investigatedPatient, isCurrentlyHospitialized: action.payload.isCurrentlyHospitialized } }
        case Actions.SET_AXIOS_INTERCEPTOR_ID: return { ...state, axiosInterceptorId: action.payload.axiosInterceptorId }
        case Actions.SET_IS_CURRENTLY_LOADING: return { ...state, isCurrentlyLoading: action.payload.isCurrentlyLoading }
        case Actions.SET_LAST_OPENED_EPIDEMIOLOGY_NUM: return { ...state, lastOpenedEpidemiologyNumber: action.payload.lastOpenedEpidemiologyNumber }
        case Actions.SET_INVESTIGATION_STATUS: return { ...state, investigationStatus: action.payload.investigationStatus }
        case Actions.SET_VALIDATION_DATE: return { ...state, validationDate: action.payload.validationDate }
        case Actions.SET_END_TIME: return { ...state, endTime: action.payload.endTime }
        case Actions.SET_CREATOR: return  { ...state, creator: action.payload.creator }
        default: return state;
    }
}

export default investigationReducer;
