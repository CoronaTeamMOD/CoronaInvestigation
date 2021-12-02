import { fetchClinicalDetails } from 'httpClient/clinicalDetails';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import FlattenedDBAddress from 'models/DBAddress';
import { ThunkAction } from 'redux-thunk';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import * as actionTypes from './ClinicalDetailsActionTypes';
import { ClinicalDetailsState } from './ClinicalDetailsReducer';

type ValueOf<T> = T[keyof T];

export const setClinicalDetails = (propertyName: keyof ClinicalDetailsData, value: ValueOf<ClinicalDetailsData>) => {
  return {
    type: actionTypes.SET_CLINICAL_DETAILS,
    payload: { propertyName, value }
  };
}

export const getClinicalDetails = (address: FlattenedDBAddress): ThunkAction<void, ClinicalDetailsState, unknown, actionTypes.ClinicalDetailsAction> => async dispatch => {
  dispatch({
    type: actionTypes.GET_CLINICAL_DETAILS_PENDING
  });

  try {
    setIsLoading(true);
    const clinicalDetails = await fetchClinicalDetails(address);
    if (clinicalDetails !== null) {
      dispatch({
        type: actionTypes.GET_CLINICAL_DETAILS_SUCCESS,
        payload: {
          clinicalDetails: clinicalDetails
        }
      });
    }
    else setIsLoading(false);
  }
  catch (err) {
    dispatch({
      type: actionTypes.GET_CLINICAL_DETAILS_ERROR,
      error: err
    });
    setIsLoading(false);
  }
}

export const resetClinicalDetails = () => {
  return {
    type: actionTypes.RESET_CLINICAL_DETAILS
  };
}