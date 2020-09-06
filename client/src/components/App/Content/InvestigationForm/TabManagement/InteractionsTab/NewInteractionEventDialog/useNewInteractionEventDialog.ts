import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        // TODO: send the interactionEventVariables to db here
        closeDialog();
    }

    return {        
        createNewInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
