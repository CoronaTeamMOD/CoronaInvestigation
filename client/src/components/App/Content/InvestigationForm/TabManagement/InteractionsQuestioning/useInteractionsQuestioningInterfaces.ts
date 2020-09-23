import InteractionContact from 'models/InteractionContact';
import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsQuestioningIncome {
    interactions: Interaction[];
    interactionContacts: InteractionContact[];
};
