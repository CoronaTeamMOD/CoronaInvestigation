import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Contact from 'models/Contact';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useDBParser from 'Utils/vendor/useDBParsing';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const useInteractionsForm = (props: useInteractionFormIncome): useInteractionFormOutcome => {
        const {loadInteractions, closeNewDialog, closeEditDialog} = props;
        const {parseLocation} = useDBParser();
        const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
        const userId = useSelector<StoreStateType, string>(state => state.user.id);

        const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
            const locationAddress = interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS] ?
                await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;
            const parsedData = {
                ...interactionsDataToSave,
                [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
                [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber,
                [InteractionEventDialogFields.CONTACTS]: interactionsDataToSave?.contacts?.map((contact: Contact) => ({
                    ...contact,
                    id: contact.idNumber
                }))
            };
            if (interactionsDataToSave[InteractionEventDialogFields.ID]) {
                const updateInteractionsLogger = logger.setup({
                    workflow: 'Update Interaction',
                    user: userId,
                    investigation: epidemiologyNumber
                })
                updateInteractionsLogger.info('launching update interaction request', Severity.LOW);
                axios.post('/intersections/updateContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        updateInteractionsLogger.info('updated interaction successfully', Severity.LOW);
                        loadInteractions();
                        closeEditDialog();
                    }
                })
                .catch((error) => {
                    updateInteractionsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                    handleFailedSave('לא ניתן היה לשמור את השינויים');
                    }
                )
            } else {
                const createInteractionsLogger = logger.setup({
                    workflow: 'Create Interaction',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                createInteractionsLogger.info('launching create interaction request', Severity.LOW);
                axios.post('/intersections/createContactEvent', parsedData).then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        createInteractionsLogger.info('created interaction successfully', Severity.LOW);
                        loadInteractions();
                        closeNewDialog();
                    } 
                })
                    .catch((error) => {
                        createInteractionsLogger.error(`got error from server: ${error}`, Severity.LOW);
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
            saveInteractions
        }
    }
;

interface useInteractionFormIncome {
    loadInteractions: () => void;
    closeNewDialog: () => void;
    closeEditDialog: () => void;
}

interface useInteractionFormOutcome {
    saveInteractions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;