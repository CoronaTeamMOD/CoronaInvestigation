import axios  from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import useDBParser from 'Utils/vendor/useDBParsing';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useContactEvent from 'Utils/ContactEvent/useContactEvent';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { ContactBankOption } from 'commons/Contexts/ContactBankContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import CreationSourceCodes from 'models/enums/CreationSourceCodes';

const useInteractionsForm = (props: useInteractionFormIncome): useInteractionFormOutcome => {
        const { loadInteractions, loadInvolvedContacts, onDialogClose, groupedInvestigationContacts, contactBank} = props;
        
        const { parseLocation } = useDBParser();
        const { alertError } = useCustomSwal();
        const { isPatientHouse } = useContactEvent();

        const shouldParseLocation = (interactionsDataToSave: InteractionEventDialogData) =>
            !isPatientHouse(interactionsDataToSave[InteractionEventDialogFields.PLACE_SUB_TYPE]) &&
                interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS];

        const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
            const locationAddress = shouldParseLocation(interactionsDataToSave) ?
                await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;
            const parsedData = {
                ...interactionsDataToSave,
                [InteractionEventDialogFields.LOCATION_ADDRESS]: locationAddress,
            };
            setIsLoading(true);
            if (interactionsDataToSave[InteractionEventDialogFields.ID]) {
                const updateInteractionsLogger = logger.setup('Update Interaction')
                updateInteractionsLogger.info('launching update interaction request', Severity.LOW);
                axios.post('/intersections/updateContactEvent', parsedData)
                .then((response) => {
                    if (response.data?.data?.updateContactEventFunction) {
                        updateInteractionsLogger.info('updated interaction successfully', Severity.LOW);
                        saveConnectedInteractions(response.data.data.updateContactEventFunction.integers[0]);
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
                        saveConnectedInteractions(response.data.data.updateContactEventFunction.integers[0]);
                    } else {
                        createInteractionsLogger.info(`response data is not valid data : ${JSON.stringify(response)}`, Severity.LOW);
                        onDialogClose();
                        alertError('לא ניתן היה ליצור אירוע חדש');
                        setIsLoading(false);
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
        
        const saveConnectedInteractions = async (eventId : number) => {
            Promise.all([saveGroupedInvestigations(eventId), saveBankContacts(eventId)]).then(() => {
                loadInteractions();
                loadInvolvedContacts();
            }).catch(() => {
                alertError('חלה שגיאה בקישור מגעים');
            }).finally(() => {
                onDialogClose();
                setIsLoading(false);
            });
        }

        const saveGroupedInvestigations = async (eventId : number) => {
            const groupedInvestigationsLogger = logger.setup('save grouped investigations contacts')
            const params = {
                eventId ,
                contacts : groupedInvestigationContacts
            }
            if(groupedInvestigationContacts.length !== 0) {
                await axios.post('/intersections/groupedInvestigationContacts' , params)
                    .then((response) => {
                        groupedInvestigationsLogger.info('added contacts successfully', Severity.LOW);
                        return;
                    })
                    .catch((error) => {
                        groupedInvestigationsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                        onDialogClose();
                        alertError('לא ניתן היה לקשר חשיפות');
                        return;
                    })
            } else {
                return;
            }
        } 

        const saveBankContacts = async (eventId : number) => {
            const saveBankLogger = logger.setup('save investigation bank contacts')
            const contacts = Array.from(contactBank)
                .filter(contact => contact[1].checked)
                .map(contact => {
                    return {
                        personInfo: contact[0],
                        extraInfo: contact[1].extraInfo,
                        contactType: contact[1].contactType,
                        creationSource: CreationSourceCodes.EVEN_YESOD
                    }
            });

            const params = {
                contactEventId: eventId,
                contacts
            }

            if(contacts.length > 0) {
                await axios.post('/intersections/addContactsFromBank' , params)
                    .then((response) => {
                        saveBankLogger.info('added contacts successfully', Severity.LOW);
                        return;
                    })
                    .catch((error) => {
                        saveBankLogger.error(`got error from server: ${error}`, Severity.HIGH);
                        onDialogClose();
                        alertError('לא ניתן היה לקשר מגעים');
                        return;
                    });
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
    contactBank: Map<number, ContactBankOption>;
}

interface useInteractionFormOutcome {
    saveInteractions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm;
