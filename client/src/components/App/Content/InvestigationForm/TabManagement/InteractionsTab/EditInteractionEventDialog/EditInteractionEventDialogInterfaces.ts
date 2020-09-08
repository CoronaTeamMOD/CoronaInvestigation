import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

export interface useEditInteractionEventInput {
    closeDialog: () => void
};

export interface useEditInteractionEventOutcome {
    editInteractionEvent: (interactionEventVariables: InteractionEventDialogData) => void;
};