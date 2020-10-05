import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    closeDialog: () => void;
    handleInteractionCreation: (addedInteraction: InteractionEventDialogData) => void;
    canConfirm: boolean;
    interactionEventDialogData: InteractionEventDialogData;
};

export interface useInteractionsTabOutcome {
    createNewInteractionEvent: (interactionEventVariables: InteractionEventDialogData) => void;
    shouldDisableSubmitButton: () => boolean;
};
