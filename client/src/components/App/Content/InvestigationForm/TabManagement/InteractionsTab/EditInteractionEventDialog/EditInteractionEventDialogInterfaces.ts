import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

export interface useEditInteractionEventInput {
    closeDialog: () => void;
    updateInteraction: (updatedInteraction: InteractionEventDialogData) => void;
    canConfirm: boolean,
    interactionEventDialogData: InteractionEventDialogData
};

export interface useEditInteractionEventOutcome {
    editInteractionEvent: (interactionEventVariables: InteractionEventDialogData) => void;
    shouldDisableSubmitButton: () => boolean;
};