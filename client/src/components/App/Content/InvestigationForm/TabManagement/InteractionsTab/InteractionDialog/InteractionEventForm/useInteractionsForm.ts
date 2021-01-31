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
        const { loadInteractions, loadInvolvedContacts, onDialogClose, groupedInvestigationContacts} = props;
        
        const { parseLocation } = useDBParser();
        const { alertError } = useCustomSwal();
        const { isPatientHouse } = useContactEvent();

        const shouldParseLocation = (interactionsDataToSave: InteractionEventDialogData) =>
            !isPatientHouse(interactionsDataToSave[InteractionEventDialogFields.PLACE_SUB_TYPE]) &&
                interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS];

        const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
            setIsLoading(true)
            const locationAddress = shouldParseLocation(interactionsDataToSave) ?
                await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;
            const parsedData = {
                ...interactionsDataToSave,
                [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
            };
            if (interactionsDataToSave[InteractionEventDialogFields.ID]) {
                const updateInteractionsLogger = logger.setup('Update Interaction')
                updateInteractionsLogger.info('launching update interaction request', Severity.LOW);
                axios.post('/intersections/updateContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        updateInteractionsLogger.info('updated interaction successfully', Severity.LOW);
                        saveGroupedInvestigations(response.data.data.updateContactEventFunction.integer);
                    }
                })
                .catch((error) => {
                    updateInteractionsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                    alertError('לא ניתן היה לשמור את השינויים');
                    setIsLoading(false);
                })
            } else {
                const createInteractionsLogger = logger.setup('Create Interaction');
                createInteractionsLogger.info('launching create interaction request', Severity.LOW);
                axios.post('/intersections/createContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        createInteractionsLogger.info('created interaction successfully', Severity.LOW);
                        saveGroupedInvestigations(response.data.data.updateContactEventFunction.integer);
                    } else {
                        createInteractionsLogger.info(`response data is not valid data : ${JSON.stringify(response)}`, Severity.LOW);
                    }
                })
                .catch((error) => {
                    createInteractionsLogger.error(`got error from server: ${error}`, Severity.LOW);
                    onDialogClose();
                    alertError('לא ניתן היה ליצור אירוע חדש');
                    setIsLoading(false);
                })
            }
        }

        const saveGroupedInvestigations = (eventId : number) => {
            const groupedInvestigationsLogger = logger.setup('save grouped investigations contacts')
            const params = {
                eventId ,
                contacts : groupedInvestigationContacts
            }
            if(groupedInvestigationContacts.length !== 0) {
                axios.post('/intersections/groupedInvestigationContacts' , params)
                    .then((response) => {
                        groupedInvestigationsLogger.info('added contacts successfully', Severity.LOW);
                        loadInteractions();
                        loadInvolvedContacts();
                        onDialogClose();
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        groupedInvestigationsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                        onDialogClose();
                        alertError('לא ניתן היה לקשר חשיפות');
                        setIsLoading(false);
                    })
            } else {
                loadInteractions();
                loadInvolvedContacts();
                onDialogClose();
                setIsLoading(false);
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
    groupedInvestigationContacts: number[];
}

interface useInteractionFormOutcome {
    saveInteractions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;
