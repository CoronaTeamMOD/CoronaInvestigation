import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    closeDialog: () => void,
    handleInteractionCreation: (addedInteraction: InteractionEventDialogData) => void,
};

export interface useInteractionsTabOutcome {
    createNewInteractionEvent: (interactionEventVariables: InteractionEventDialogData) => void;
};