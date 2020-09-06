import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    closeDialog: () => void
};

export interface useInteractionsTabOutcome {
    createNewInteractionEvent: (interactionEventVariables: InteractionEventDialogData) => void;
};