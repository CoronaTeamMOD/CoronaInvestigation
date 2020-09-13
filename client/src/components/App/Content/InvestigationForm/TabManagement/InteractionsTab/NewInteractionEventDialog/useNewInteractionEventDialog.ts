import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useInteractionsTabOutcome, useInteractionsTabInput } from './NewInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { closeDialog, handleInteractionCreation } = input;

    const createNewInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        axios.post('/intersections/createContactEvent', {...interactionEventVariables}).then(() => {
            handleInteractionCreation(interactionEventVariables);
            closeDialog();
        }).catch(() => {
            handleCreateEventFailed();
        })
    }

    const handleCreateEventFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה ליצור אירוע חדש',
            icon: 'error',
        })
    };

    return {        
        createNewInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
