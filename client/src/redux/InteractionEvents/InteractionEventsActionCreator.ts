import InteractionEventDialogData from "models/Contexts/InteractionEventDialogData";
import * as actionTypes from './InteractionEventsActionTypes';

export const setAllInteractionEvents = (allInteractionEvents: InteractionEventDialogData[] ) =>{
    return {
        type: actionTypes.SET_ALL_INTERACTION_EVENTS,
        payload: { allInteractionEvents }
      };
}

