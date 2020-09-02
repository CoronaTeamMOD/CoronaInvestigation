import { InteractionEventVariables } from './InteractionEventVariables';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventVariables) : void => {
        console.log(interactionEventVariables);
        closeDialog();
        // TODO: insert the event from db
    }

    return {        
        createNewInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
