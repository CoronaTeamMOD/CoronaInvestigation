import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import useDBParser from "Utils/vendor/useDBParsing";
import Validator from 'Utils/Validations/Validator';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";

import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    const {parseLocation} = useDBParser();
    useGoogleApiAutocomplete();
    const { closeDialog, handleInteractionCreation, canConfirm, interactionEventDialogData } = input;

    const createNewInteractionEvent = async(interactionEventVariables: InteractionEventDialogData) : Promise<any> => {
        const locationAddress = await parseLocation(interactionEventVariables.locationAddress.address);

        const newData =  {
            ...interactionEventVariables,
            locationAddress,
            contactPersonPhoneNumber: interactionEventVariables.contactPersonPhoneNumber?.number,
            contacts: interactionEventVariables.contacts.map(contact => ({...contact, phoneNumber: contact.phoneNumber.number}))
        };

        axios.post('/intersections/createContactEvent', newData)
            .then((response) => {
                interactionEventVariables.id = response.data.data.updateContactEventFunction.integer;
                handleInteractionCreation(interactionEventVariables);
                closeDialog();
            })
            .catch((error) => {
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
