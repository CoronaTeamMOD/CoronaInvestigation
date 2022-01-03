import { MutationInfo } from '../../models/InvestigationInfo';

export const GET_MUTATION_INFO_PENDING = 'GET_MUTATION_INFO_PENDING';
export const GET_MUTATION_INFO_SUCCESS = 'GET_MUTATION_INFO_SUCCESS';
export const GET_MUTATION_INFO_ERROR = 'GET_MUTATION_INFO_ERROR';

interface GetMutationInfoPending {
    type: typeof GET_MUTATION_INFO_PENDING
}

interface GetMutationInfoSuccess {
    type: typeof GET_MUTATION_INFO_SUCCESS,
    payload: {
        mutationInfo: MutationInfo,
        wasMutationUpdated: boolean
    }
}

interface GetMutationInfoError {
    type: typeof GET_MUTATION_INFO_ERROR,
    error: any
}

export type mutationInfoAction = GetMutationInfoPending | GetMutationInfoSuccess | GetMutationInfoError;