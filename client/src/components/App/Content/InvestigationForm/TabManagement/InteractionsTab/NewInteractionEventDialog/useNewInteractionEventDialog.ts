import axios from 'Utils/axios'
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        console.log({...interactionEventVariables});
        const {contacts, ...interactionEventToSend} = interactionEventVariables;
        console.log('sending new event to server: ');
        console.log({...interactionEventToSend});
        axios.post('/contactEvents/createContactEvent', {
            event: {...interactionEventVariables},
            // contacts: {...contacts}
        }).then(res => {
            contacts.forEach((contactedPerson) => {
                contactedPerson.contactEvent = res.data;
            });

        });
        closeDialog();
    }

    return {        
        createNewInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
