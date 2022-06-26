import { defaultEpidemiologyNumber } from 'Utils/consts';
import InvestigationRedux from 'models/InvestigationRedux';
import { getDatesToInvestigate, getOldDatesToInvestigate } from 'Utils/ClinicalDetails/symptomsUtils';

import * as Actions from './investigationActionTypes';

export const DEFAULT_INVESTIGATION_STATUS = -1;

const initialState: InvestigationRedux = {
    epidemiologyNumber: defaultEpidemiologyNumber,
    complexReasonsId: [null],
    investigationStatus: {
        mainStatus: DEFAULT_INVESTIGATION_STATUS,
        subStatus: '',
        statusReason: ''
    },
    investigatedPatient: {
        investigatedPatientId: -1,
        isDeceased: false,
        isCurrentlyHospitialized: false,
        birthDate: new Date(),
        fullName:''
    },
    doesHaveSymptoms: false,
    symptomsStartDate: null,
    datesToInvestigate: [],
    oldDatesToInvestigate: {minDate: undefined,maxDate: undefined},
    creator: '',
    lastUpdator: '',
    lastOpenedEpidemiologyNumber: defaultEpidemiologyNumber,
    isCurrentlyLoading: false,
    axiosInterceptorId: -1,
    validationDate: new Date(),
    endTime: null,
    trackingRecommendation: {
        reason: null,
    },
    isViewMode: false,
    contactInvestigationVerifiedAbroad: false,
    investigationStaticFieldChange: false,
    comment: null,
    trackingRecommendationChanged: false,
    investigationInfoChanged: false,
    contactFromAboardId: null,
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction): InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM: return { ...state, epidemiologyNumber: action.payload.epidemiologyNumber }
        case Actions.SET_COMPLEX_REASONS_ID: return { ...state, complexReasonsId: action.payload.complexReasonsId }
        case Actions.SET_INVESTIGATED_PATIENT_ID: return { ...state, investigatedPatient: { ...state.investigatedPatient, investigatedPatientId: action.payload.investigatedPatientId } }
        case Actions.SET_IS_DECEASED: return { ...state, investigatedPatient: { ...state.investigatedPatient, isDeceased: action.payload.isDeceased } }
        case Actions.SET_IS_CURRENTLY_HOSPITIALIZED: return { ...state, investigatedPatient: { ...state.investigatedPatient, isCurrentlyHospitialized: action.payload.isCurrentlyHospitialized } }
        case Actions.SET_AXIOS_INTERCEPTOR_ID: return { ...state, axiosInterceptorId: action.payload.axiosInterceptorId }
        case Actions.SET_IS_CURRENTLY_LOADING: return { ...state, isCurrentlyLoading: action.payload.isCurrentlyLoading }
        case Actions.SET_LAST_OPENED_EPIDEMIOLOGY_NUM: return { ...state, lastOpenedEpidemiologyNumber: action.payload.lastOpenedEpidemiologyNumber }
        case Actions.SET_INVESTIGATION_STATUS: return { ...state, investigationStatus: { ...action.payload.investigationStatus, previousStatus: state.investigationStatus.mainStatus } }
        case Actions.SET_DATES_TO_INVESTIGATE_PARAMS: {
            const { validationDate: newValidationDate, symptomsExistenceInfo } = action.payload;
            const validationDate = newValidationDate || state.validationDate;
            const doesHaveSymptoms = symptomsExistenceInfo ? symptomsExistenceInfo.doesHaveSymptoms : state.doesHaveSymptoms;
            const symptomsStartDate = symptomsExistenceInfo ? symptomsExistenceInfo.symptomsStartDate : state.symptomsStartDate;
            return {
                ...state,
                validationDate,
                doesHaveSymptoms,
                symptomsStartDate,
                datesToInvestigate: getDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, validationDate)
            }
        }
        case Actions.SET_OLD_DATES_TO_INVESTIGATE_PARAMS:{
            const { validationDate: newValidationDate, symptomsExistenceInfo } = action.payload;
            const validationDate = newValidationDate || state.validationDate;
            const doesHaveSymptoms = symptomsExistenceInfo ? symptomsExistenceInfo.doesHaveSymptoms : state.doesHaveSymptoms;
            const symptomsStartDate = symptomsExistenceInfo ? symptomsExistenceInfo.symptomsStartDate : state.symptomsStartDate;
            const oldDatesToInvestigate = getOldDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, validationDate);
            
            return { ...state, oldDatesToInvestigate:oldDatesToInvestigate }
        } 
        case Actions.SET_END_TIME: return { ...state, endTime: action.payload.endTime }
        case Actions.SET_TRACKING_RECOMMENDATION: return { ...state, trackingRecommendation: action.payload.trackingRecommendation }
        case Actions.SET_CREATOR: return { ...state, creator: action.payload.creator }
        case Actions.SET_BIRTH_DATE: return { ...state, investigatedPatient: { ...state.investigatedPatient, birthDate: action.payload.birthDate } }
        case Actions.RESET_STATE: return initialState
        case Actions.SET_INVESTIGATION_VIEW_MODE: return { ...state, isViewMode: action.payload.isViewMode }
        case Actions.SET_IS_CONTACT_INVESTIGATION_VERIFIED_ABROAD: return { ...state, contactInvestigationVerifiedAbroad: action.payload.isContactInvestigationVerifiedAbroad }
        case Actions.SET_INVESTIGATION_STATIC_FIELD_CHANGE: return { ...state, investigationStaticFieldChange: action.payload.investigationStaticFieldChange }
        case Actions.SET_INVESTIGATED_PATIENT_FULLNAME: return {...state, investigatedPatient:{...state.investigatedPatient, fullName: action.payload.fullName}}
        case Actions.SET_INVESTIGATION_COMMENT: return {...state, comment: action.payload.comment}
        case Actions.SET_TRACKING_RECOMMENDATION_CHANGED: return {...state, trackingRecommendationChanged: action.payload.trackingRecommendationChanged}
        case Actions.SET_INVESTIGATION_INFO_CHANGED : return {...state, investigationInfoChanged : action.payload.investigationInfoChanged} 
        case Actions.SET_INVESTIGATION_CONTACT_FROM_ABOARD_ID : return {...state, contactFromAboardId: action.payload.contactFromAboardId}
        default: return state;
    }
}

export default investigationReducer;
