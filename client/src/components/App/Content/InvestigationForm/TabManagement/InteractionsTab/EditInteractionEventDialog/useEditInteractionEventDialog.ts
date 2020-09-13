import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useEditInteractionEventInput, useEditInteractionEventOutcome } from './EditInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useEditInteractionEventInput) :  useEditInteractionEventOutcome => {
    
    const { closeDialog } = input;

    const editInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        axios.post('/intersections/updateContactEvent', {...interactionEventVariables}).then(() => {
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

    return {        
        editInteractionEvent,
    }
};

export default useNewInteractionEventDialog;
