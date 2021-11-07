import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { initialClinicalDetails } from 'components/App/Content/InvestigationForm/TabManagement/ClinicalDetails/useClinicalDetails';
import * as Actions from './ClinicalDetailsActionTypes';

export interface ClinicalDetailsState {
    clinicalDetails: ClinicalDetailsData | null;
    pending: boolean;
    error: any;
}

const initialState: ClinicalDetailsState = {
    clinicalDetails: null,
    pending: false,
    error: null
};

const clinicalDetailsReducer = (state = initialState, action: Actions.ClinicalDetailsAction): ClinicalDetailsState => {
    switch (action.type) {
        case Actions.GET_CLINICAL_DETAILS_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.GET_CLINICAL_DETAILS_SUCCESS:
            return {
                ...state,
                pending: false,
                clinicalDetails: action.payload.clinicalDetails
            }
        case Actions.GET_CLINICAL_DETAILS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case Actions.SET_CLINICAL_DETAILS: {
            if (state.clinicalDetails) {
                return {
                    ...state,
                    clinicalDetails: { ...state.clinicalDetails, [action.payload.propertyName]: action.payload.value }
                };
            }
            else {
                return state;
            }
        }
        case Actions.RESET_CLINICAL_DETAILS:  
            return {
                ...state,
                clinicalDetails: null
            } 
        

        default: return state;
    }
}

export default clinicalDetailsReducer;