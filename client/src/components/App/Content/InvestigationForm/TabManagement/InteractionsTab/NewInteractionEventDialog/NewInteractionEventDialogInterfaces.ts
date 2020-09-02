import { InteractionEventVariables } from './InteractionEventVariables';

export interface useInteractionsTabInput {
    closeDialog: () => void
};

export interface useInteractionsTabOutcome {
    createNewInteractionEvent: (interactionEventVariables: InteractionEventVariables) => void;
};