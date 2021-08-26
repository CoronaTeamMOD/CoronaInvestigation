import { fetchClinicalDetails } from 'httpClient/InteractedContacts/clinicalDetails';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import FlattenedDBAddress from 'models/DBAddress';
import { ThunkAction } from 'redux-thunk';
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
    const clinicalDetails = await fetchClinicalDetails(address);
    console.log('in action creator',clinicalDetails);
    if (clinicalDetails !== null) {
      dispatch({
        type: actionTypes.GET_CLINICAL_DETAILS_SUCCESS,
        payload: {
          clinicalDetails: clinicalDetails
        }
      });
    }

  }
  catch (err) {
    dispatch({
      type: actionTypes.GET_CLINICAL_DETAILS_ERROR,
      error: err
    });
  }
}

export const resetClinicalDetails = () => {
  return {
    type: actionTypes.RESET_CLINICAL_DETAILS
  };
}