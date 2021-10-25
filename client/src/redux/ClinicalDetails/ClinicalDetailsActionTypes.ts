import ClinicalDetailsData from '../../models/Contexts/ClinicalDetailsContextData';

export const GET_CLINICAL_DETAILS_PENDING = 'GET_CLINICAL_DETAILS_PENDING';
export const GET_CLINICAL_DETAILS_SUCCESS = 'GET_CLINICAL_DETAILS_SUCCESS';
export const GET_CLINICAL_DETAILS_ERROR = 'GET_CLINICAL_DETAILS_ERROR';
export const SET_CLINICAL_DETAILS = 'SET_CLINICAL_DETAILS';
export const RESET_CLINICAL_DETAILS = 'RESET_CLINICAL_DETAILS';

type ValueOf<T> = T[keyof T];

interface GetClinicalDetailsPending {
    type: typeof GET_CLINICAL_DETAILS_PENDING
}

interface GetClinicalDetailsSuccess {
    type: typeof GET_CLINICAL_DETAILS_SUCCESS,
    payload: {
        clinicalDetails: ClinicalDetailsData | null
    }
}

interface GetClinicalDetailsError {
    type: typeof GET_CLINICAL_DETAILS_ERROR,
    error: any
}

interface SetClinicalDetails {
    type: typeof SET_CLINICAL_DETAILS,
    payload: {
        propertyName: keyof ClinicalDetailsData, 
        value: ValueOf<ClinicalDetailsData>
    }
}

interface ResetClinicalDetails {
    type: typeof RESET_CLINICAL_DETAILS,
}


export type ClinicalDetailsAction = SetClinicalDetails | GetClinicalDetailsPending | GetClinicalDetailsSuccess | GetClinicalDetailsError | ResetClinicalDetails ;