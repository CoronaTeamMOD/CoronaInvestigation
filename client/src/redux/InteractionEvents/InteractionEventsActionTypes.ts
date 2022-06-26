import InteractionEventDialogData from "models/Contexts/InteractionEventDialogData";

export const SET_ALL_INTERACTION_EVENTS = 'SET_ALL_INTERACTION_EVENTS';
export const SET_UPDATE_INVESTIGATION_CONTACT_FROM_ABOARD = 'SET_UPDATE_INVESTIGATION_CONTACT_FROM_ABOARD';

interface SetInteractionEvents {
    type: typeof SET_ALL_INTERACTION_EVENTS,
    payload: { allInteractionEvents : InteractionEventDialogData[]}
}

export type InteractionEventsAction = SetInteractionEvents;