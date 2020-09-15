import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import Validator from 'Utils/Validations/Validator';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog, handleInteractionCreation, canConfirm, interactionEventDialogData } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        axios.post('/intersections/createContactEvent',
        {
            ...interactionEventVariables, 
            contactPersonPhoneNumber: interactionEventVariables.contactPersonPhoneNumber?.number
        }).then((response) => {
            interactionEventVariables.id = response.data.data.updateContactEventFunction.integer;
            handleInteractionCreation(interactionEventVariables);
            closeDialog();
        }).catch((error) => {
            console.log(error);
            closeDialog();
            handleCreateEventFailed();
        })
    }

    const handleCreateEventFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה ליצור אירוע חדש',
            icon: 'error',
        })
    };

    const shouldDisableSubmitButton = () : boolean => {
         return (
            !canConfirm || Validator.formValidation(interactionEventDialogData) || 
            interactionEventDialogData.contacts.some((contact) => Validator.formValidation(contact))
         );
    }

    return {        
        createNewInteractionEvent,
        shouldDisableSubmitButton
    }
};

export default useNewInteractionEventDialog;
