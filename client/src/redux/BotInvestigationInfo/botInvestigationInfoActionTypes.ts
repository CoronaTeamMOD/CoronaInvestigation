import KeyValuePair from 'models/KeyValuePair';
import { BotInvestigationInfo } from '../../models/InvestigationInfo';

export const GET_BOT_INVESTIGATION_INFO_PENDING = 'GET_BOT_INVESTIGATION_INFO_PENDING';
export const GET_BOT_INVESTIGATION_INFO_SUCCESS = 'GET_BOT_INVESTIGATION_INFO_SUCCESS';
export const GET_BOT_INVESTIGATION_INFO_ERROR = 'GET_BOT_INVESTIGATION_INFO_ERROR';
export const SET_INVESTIGATOR_REFERENCE_STATUS = 'SET_INVESTIGATOR_REFERENCE_STATUS';
export const SET_INVESTIGATOR_REFERENCE_STATUS_WAS_CHANGED = 'SET_INVESTIGATOR_REFERENCE_STATUS_WAS_CHANGED';



interface GetBotInvestigationInfoPending {
    type: typeof GET_BOT_INVESTIGATION_INFO_PENDING
}

interface GetBotInvestigationInfoSuccess {
    type: typeof GET_BOT_INVESTIGATION_INFO_SUCCESS,
    payload: {
        botInvestigationInfo: BotInvestigationInfo | null
    }
}

interface GetBotInvestigationInfoError {
    type: typeof GET_BOT_INVESTIGATION_INFO_ERROR,
    error: any
}

interface SetInvestigatorReferenceStatus {
    type: typeof SET_INVESTIGATOR_REFERENCE_STATUS,
    payload: {
        investigatorReferenceStatus: KeyValuePair
    }
}

interface SetInvestigatorReferenceStatusWasChanged {
    type: typeof SET_INVESTIGATOR_REFERENCE_STATUS_WAS_CHANGED,
    payload: {
        investigatorReferenceStatusWasChanged: boolean
    }
}

export type BotInvestigationInfoAction = GetBotInvestigationInfoPending | GetBotInvestigationInfoSuccess | GetBotInvestigationInfoError
    | SetInvestigatorReferenceStatus | SetInvestigatorReferenceStatusWasChanged;