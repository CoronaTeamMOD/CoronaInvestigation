import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import Validator from 'Utils/Validations/Validator';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useEditInteractionEventInput, useEditInteractionEventOutcome } from './EditInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useEditInteractionEventInput) :  useEditInteractionEventOutcome => {
    
    const { closeDialog, updateInteraction, canConfirm, interactionEventDialogData } = input;

    const editInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        // TODO: Add db connection
        axios.post('/intersections/updateContactEvent', {
            ...interactionEventVariables,
            contactPersonPhoneNumber: interactionEventVariables.contactPersonPhoneNumber?.number,
            contacts: interactionEventVariables.contacts.map(contact => ({...contact, phoneNumber: contact.phoneNumber.number}))
        })
            .then(() => {
                updateInteraction(interactionEventVariables);
                closeDialog();
        }).catch(() => {
            handleEditEventFailed();
        })
    }

    const handleEditEventFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לשמור את השינויים',
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
        editInteractionEvent,
        shouldDisableSubmitButton
    }
};

export default useNewInteractionEventDialog;
