import { MutationInfo } from '../../models/InvestigationInfo';
import * as Actions from './mutationInfoActionTypes';

export interface MutationInfoState {
    mutationInfo: MutationInfo;
    pending: boolean;
    error: any;
}

const initialState: MutationInfoState = {
    mutationInfo: {isSuspicionOfMutation: false, mutationName: ''},
    pending: false,
    error: null
};

const mutationInfoReducer = (state = initialState, action: Actions.mutationInfoAction): MutationInfoState => {
    switch (action.type) {
        case Actions.GET_MUTATION_INFO_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.GET_MUTATION_INFO_SUCCESS:
            return {
                ...state,
                pending: false,
                mutationInfo: action.payload.mutationInfo
            }
        case Actions.GET_MUTATION_INFO_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        default: return state;
    }
}

export default mutationInfoReducer;