import axios from 'Utils/axios'
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        console.log({...interactionEventVariables});
        axios.post('/contactEvent/createEvent').then()
        closeDialog();
    }

    return {        
        createNewInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
