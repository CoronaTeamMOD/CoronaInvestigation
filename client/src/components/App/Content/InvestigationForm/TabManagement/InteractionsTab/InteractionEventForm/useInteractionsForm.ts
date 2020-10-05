import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import useDBParser from 'Utils/vendor/useDBParsing';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';


const useInteractionsForm = (props : useInteractionFormIncome): useInteractionFormOutcome => {  
  const { interactionId, loadInteractions, closeNewDialog, closeEditDialog } = props;    
  const { parseLocation } = useDBParser();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const saveIntreactions = async (interactionsDataToSave: InteractionEventDialogData) => {
      const locationAddress = interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS] ? 
            await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;

      if (interactionId) {
        axios.post('/intersections/updateContactEvent', {
          ...interactionsDataToSave,
          locationAddress,
          id: interactionId,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber
        })
          .then(() => {
            loadInteractions();
            closeEditDialog();
          }).catch(() => {
            handleFailedSave('לא ניתן היה לשמור את השינויים');
          })
      } else {
        axios.post('/intersections/createContactEvent', {
          ...interactionsDataToSave,
          locationAddress,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber
        })
          .then((response) => {
            loadInteractions()
            closeNewDialog();
          })
          .catch((error) => {
              console.log(error);
              closeNewDialog();
              handleFailedSave('לא ניתן היה ליצור אירוע חדש');
          })
        }
    }

    const handleFailedSave = (message: string) => {
      Swal.fire({
        title: message,
        icon: 'error',
      })
    }

    return {
        saveIntreactions
    }
};

interface useInteractionFormIncome {
  interactionId?: number;
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
}

interface useInteractionFormOutcome {
  saveIntreactions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;
