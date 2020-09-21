import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import useDBParser from "Utils/vendor/useDBParsing";
import Validator from 'Utils/Validations/Validator';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useEditInteractionEventInput, useEditInteractionEventOutcome } from './EditInteractionEventDialogInterfaces';

const useNewInteractionEventDialog =  (input: useEditInteractionEventInput) :  useEditInteractionEventOutcome => {
    const {parseLocation} = useDBParser();
    const { closeDialog, updateInteraction, canConfirm, interactionEventDialogData } = input;

    const editInteractionEvent = async (interactionEventVariables: InteractionEventDialogData) : Promise<any> => {
        const locationAddress = await parseLocation(interactionEventVariables.locationAddress);
        const newData = {
            ...interactionEventVariables,
            locationAddress,
            contactPersonPhoneNumber: interactionEventVariables.contactPersonPhoneNumber?.number,
            contacts: interactionEventVariables.contacts.map(contact => ({
                ...contact,
                phoneNumber: contact.phoneNumber.number
            }))
        };
        axios.post('/intersections/updateContactEvent', newData)
            .then(() => {
                updateInteraction(interactionEventVariables);
                closeDialog();
            }).catch(() => {
            handleEditEventFailed();
        })
    };

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
