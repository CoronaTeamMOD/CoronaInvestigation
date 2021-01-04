import axios  from 'axios';
import {useSelector} from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useDBParser from 'Utils/vendor/useDBParsing';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useContactEvent from 'Utils/ContactEvent/useContactEvent';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const useInteractionsForm = (props: useInteractionFormIncome): useInteractionFormOutcome => {
        const { loadInteractions, loadInvolvedContacts, onDialogClose} = props;
        
        const { parseLocation } = useDBParser();
        const { alertError } = useCustomSwal();
        const { isPatientHouse } = useContactEvent();

        const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

        const shouldParseLocation = (interactionsDataToSave: InteractionEventDialogData) =>
            !isPatientHouse(interactionsDataToSave[InteractionEventDialogFields.PLACE_SUB_TYPE]) &&
                interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS];

        const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
            const locationAddress = shouldParseLocation(interactionsDataToSave) ?
                await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;
            const parsedData = {
                ...interactionsDataToSave,
                [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
                [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber
            };
            setIsLoading(true)
            if (interactionsDataToSave[InteractionEventDialogFields.ID]) {
                const updateInteractionsLogger = logger.setup('Update Interaction')
                updateInteractionsLogger.info('launching update interaction request', Severity.LOW);
                axios.post('/intersections/updateContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        updateInteractionsLogger.info('updated interaction successfully', Severity.LOW);
                        loadInteractions();
                        loadInvolvedContacts();
                        onDialogClose();
                    }
                })
                .catch((error) => {
                    updateInteractionsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                    alertError('לא ניתן היה לשמור את השינויים');
                    }
                )
                .finally(() => setIsLoading(false));
            } else {
                const createInteractionsLogger = logger.setup('Create Interaction');
                createInteractionsLogger.info('launching create interaction request', Severity.LOW);
                axios.post('/intersections/createContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        createInteractionsLogger.info('created interaction successfully', Severity.LOW);
                        loadInteractions();
                        loadInvolvedContacts();
                        onDialogClose();
                    } 
                })
                .catch((error) => {
                    createInteractionsLogger.error(`got error from server: ${error}`, Severity.LOW);
                    onDialogClose();
                    alertError('לא ניתן היה ליצור אירוע חדש');
                })
                .finally(() => setIsLoading(false));
            }
        }

        return {
            saveInteractions
        }
    }
;

interface useInteractionFormIncome {
    loadInteractions: () => void;
    loadInvolvedContacts:() => void;
    onDialogClose: () => void;
}

interface useInteractionFormOutcome {
    saveInteractions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;
