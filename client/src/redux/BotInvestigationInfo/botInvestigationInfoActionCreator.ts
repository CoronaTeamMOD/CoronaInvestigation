import { fetchBotInvestigationData } from 'httpClient/investigationInfo';
import { ThunkAction } from 'redux-thunk';
import * as actionTypes from './botInvestigationInfoActionTypes';
import { BotInvestigationInfoState } from './botInvestigationInfoReducer';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import KeyValuePair from 'models/KeyValuePair';

export const getBotInvestigationInfo = (): ThunkAction<void, BotInvestigationInfoState, unknown, actionTypes.BotInvestigationInfoAction> => async dispatch => {
  dispatch({
    type: actionTypes.GET_BOT_INVESTIGATION_INFO_PENDING
  });

  try {
    setIsLoading(true);
    const botInvestigationInfo = await fetchBotInvestigationData();
    if (botInvestigationInfo !== null) {
      dispatch({
        type: actionTypes.GET_BOT_INVESTIGATION_INFO_SUCCESS,
        payload: {
          botInvestigationInfo: botInvestigationInfo
        }
      });
    }
    else setIsLoading(false);
  }
  catch (err) {
    dispatch({
      type: actionTypes.GET_BOT_INVESTIGATION_INFO_ERROR,
      error: err
    });
    setIsLoading(false);
  }
}

export const setInvestigatorReferenceStatus = (investigatorReferenceStatus: KeyValuePair) => {
  return {
    type: actionTypes.SET_INVESTIGATOR_REFERENCE_STATUS,
    payload: { investigatorReferenceStatus }
  };
}

export const setInvestigatorReferenceStatusWasChanged = (investigatorReferenceStatusWaschanged: boolean) => {
  return {
    type: actionTypes.SET_INVESTIGATOR_REFERENCE_STATUS_WAS_CHANGED,
    payload: { investigatorReferenceStatusWaschanged }
  };
}
