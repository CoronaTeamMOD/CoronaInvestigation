import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useEditInteractionEventInput, useEditInteractionEventOutcome } from './EditInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useEditInteractionEventInput) :  useEditInteractionEventOutcome => {
    
    const { closeDialog } = input;

    const editInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        // TODO: send the interactionEventVariables to db here
        closeDialog();
    }

    return {        
        editInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
