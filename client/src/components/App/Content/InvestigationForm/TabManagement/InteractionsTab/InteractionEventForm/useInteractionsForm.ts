import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Contact from 'models/Contact';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useDBParser from 'Utils/vendor/useDBParsing';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';


const useInteractionsForm = (props : useInteractionFormIncome): useInteractionFormOutcome => {  
  const { loadInteractions, closeNewDialog, closeEditDialog } = props;    
  const { parseLocation } = useDBParser();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
      const locationAddress = interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS] ? 
            await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;

      if (interactionsDataToSave[InteractionEventDialogFields.ID]) {
        logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Update Interaction',
          step: `launching update interaction request`,
          user: userId,
          investigation: epidemiologyNumber
        });
        axios.post('/intersections/updateContactEvent', {
          ...interactionsDataToSave,
          [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber,
          [InteractionEventDialogFields.CONTACTS]: interactionsDataToSave?.contacts?.map((contact: Contact) => ({
            ...contact,
            id: contact.idNumber
          }))
        })
          .then(() => {
            logger.info({
              service: Service.CLIENT,
              severity: Severity.LOW,
              workflow: 'Update Interaction',
              step: 'updated interaction successfully',
              user: userId,
              investigation: epidemiologyNumber
            });
            loadInteractions();
            closeEditDialog();
          }).catch((error) => {
            logger.error({
              service: Service.CLIENT,
              severity: Severity.LOW,
              workflow: 'Update Interaction',
              step: `got error from server: ${error}`,
              investigation: epidemiologyNumber,
              user: userId
            });
            handleFailedSave('לא ניתן היה לשמור את השינויים');
          })
      } else {
        logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Create Interaction',
          step: `launching create interaction request`,
          user: userId,
          investigation: epidemiologyNumber
        });
        axios.post('/intersections/createContactEvent', {
          ...interactionsDataToSave,
          [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber,
          [InteractionEventDialogFields.CONTACTS]: interactionsDataToSave?.contacts?.map((contact: Contact) => ({
            ...contact,
            id: contact.idNumber
          }))
        })
          .then(() => {
            logger.info({
              service: Service.CLIENT,
              severity: Severity.LOW,
              workflow: 'Create Interaction',
              step: 'created interaction successfully',
              user: userId,
              investigation: epidemiologyNumber
            });
            loadInteractions()
            closeNewDialog();
          })
          .catch((error) => {
              logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Create Interaction',
                step: `got error from server: ${error}`,
                investigation: epidemiologyNumber,
                user: userId
              });
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
        saveInteractions: saveInteractions
    }
};

interface useInteractionFormIncome {
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
}

interface useInteractionFormOutcome {
  saveInteractions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;
