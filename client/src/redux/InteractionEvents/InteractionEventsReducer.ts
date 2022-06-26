import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import * as Actions from './InteractionEventsActionTypes';

export interface InteractionEventsState {
    interactionEvents: InteractionEventDialogData[];
}

const initialState: InteractionEventsState = {
    interactionEvents:[]
}

const interactionEventsReducer = (state = initialState, action: Actions.InteractionEventsAction) => {
    switch (action.type) {
        case Actions.SET_ALL_INTERACTION_EVENTS:
            return {
                ...state,
                interactionEvents : action.payload.allInteractionEvents
            }
        default: return state;
    }
}

export default interactionEventsReducer;