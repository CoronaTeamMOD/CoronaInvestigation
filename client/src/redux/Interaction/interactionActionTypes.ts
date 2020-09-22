import Interaction from 'models/Contexts/InteractionEventDialogData';

export const SET_INTERACTIONS = 'SET_INTERACTIONS';

interface SetInteractions {
    type: typeof SET_INTERACTIONS,
    payload: {interactions: Interaction[]}
}

export type interactionAction = SetInteractions;
