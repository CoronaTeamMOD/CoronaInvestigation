import { BotInvestigationInfo } from 'models/InvestigationInfo';
import * as Actions from './botInvestigationInfoActionTypes';

export interface BotInvestigationInfoState {
    botInvestigationInfo: BotInvestigationInfo | null;
    pending: boolean;
    error: any;
    investigatorReferenceStatusWasChanged: boolean;
}

const initialState: BotInvestigationInfoState = {
    botInvestigationInfo: null,
    pending: false,
    error: null,
    investigatorReferenceStatusWasChanged: false
};

const botInvestigationInfoReducer = (state = initialState, action: Actions.BotInvestigationInfoAction): BotInvestigationInfoState => {
    switch (action.type) {
        case Actions.GET_BOT_INVESTIGATION_INFO_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.GET_BOT_INVESTIGATION_INFO_SUCCESS:
            return {
                ...state,
                pending: false,
                botInvestigationInfo: action.payload.botInvestigationInfo
            }
        case Actions.GET_BOT_INVESTIGATION_INFO_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case Actions.SET_INVESTIGATOR_REFERENCE_STATUS: {
            if (state.botInvestigationInfo) {
                return {
                    ...state,
                    botInvestigationInfo: { ...state.botInvestigationInfo, investigatorReferenceStatus: action.payload.investigatorReferenceStatus },
                    investigatorReferenceStatusWasChanged: true
                };
            }
            else {
                return state;
            }
        }
        case Actions.SET_INVESTIGATOR_REFERENCE_STATUS_WAS_CHANGED: {
            return {
                ...state,
                investigatorReferenceStatusWasChanged: action.payload.investigatorReferenceStatusWasChanged
            }
        }

        default: return state;
    }
}

export default botInvestigationInfoReducer;