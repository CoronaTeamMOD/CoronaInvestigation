import { fetchMutationData } from '../../httpClient/investigationInfo';
import { ThunkAction } from 'redux-thunk';
import * as actionTypes from './mutationInfoActionTypes';
import { MutationInfoState } from './mutationInfoReducer';
import { setIsLoading } from '../../redux/IsLoading/isLoadingActionCreators';

export const getMutationInfo = (): ThunkAction<void, MutationInfoState, unknown, actionTypes.mutationInfoAction> => async dispatch => {
  dispatch({
    type: actionTypes.GET_MUTATION_INFO_PENDING
  });

  try {
    setIsLoading(true);
    const fullMutationInfo = await fetchMutationData();
    if (fullMutationInfo !== null) {
      dispatch({
        type: actionTypes.GET_MUTATION_INFO_SUCCESS,
        payload: {
            mutationInfo: {isSuspicionOfMutation: fullMutationInfo?.isSuspicionOfMutation,
                          mutationName:  fullMutationInfo?.mutationName},
            wasMutationUpdated: fullMutationInfo?.wasMutationUpdated
        }
      });
    }
    else setIsLoading(false);
  }
  catch (err) {
    dispatch({
      type: actionTypes.GET_MUTATION_INFO_ERROR,
      error: err
    });
    setIsLoading(false);
  }
}
