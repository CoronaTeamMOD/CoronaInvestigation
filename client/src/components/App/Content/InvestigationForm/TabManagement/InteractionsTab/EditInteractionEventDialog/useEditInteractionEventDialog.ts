import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import { useEditInteractionEventInput, useEditInteractionEventOutcome } from './EditInteractionEventDialogInterfaces';

const useNewInteractionEventDialog = (input: useEditInteractionEventInput) :  useEditInteractionEventOutcome => {
    
    const { closeDialog, updateInteraction } = input;

    const editInteractionEvent = (interactionEventVariables: InteractionEventDialogData) : void => {
        updateInteraction(interactionEventVariables);
        closeDialog();
        // TODO: Add db connection
        // axios.post('/intersections/updateContactEvent', {...interactionEventVariables}).then(() => {
        // }).catch(() => {
        //     handleEditEventFailed();
        // })
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
