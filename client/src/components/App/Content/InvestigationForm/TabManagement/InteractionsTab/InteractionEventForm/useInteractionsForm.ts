import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Contact from 'models/Contact';
import {Service, Severity} from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useDBParser from 'Utils/vendor/useDBParsing';
import useSwalStyles from 'commons/CustomSwal/CustomSwalStyles';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './InteractionEventFormStyles';
import {duplicateIdsErrorMsg} from '../../ContactQuestioning/ContactQuestioning';

const useInteractionsForm = (props: useInteractionFormIncome): useInteractionFormOutcome => {
    const classes = useStyles();
    const swalClasses = useSwalStyles();
    const {loadInteractions, closeNewDialog, closeEditDialog} = props;
    const {parseLocation} = useDBParser();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const checkForDuplicateIdsInContactEvent = (currContacts: Contact[]) => {
        const allIdentificationNumbers = currContacts.map((contact) => contact.idNumber);
        return allIdentificationNumbers.some((idNumber, idNumberIndex) => {
            return allIdentificationNumbers.indexOf(idNumber) !== idNumberIndex && idNumber !== undefined
        });
    }

    const handleDuplicatesError = (duplicateIdNumber: string) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Create Interaction',
            step: 'Didnt save interactions due to duplicate ids',
            user: userId,
            investigation: epidemiologyNumber
        });
        Swal.fire({
            title: 'שים לב, מספר זיהוי ' + duplicateIdNumber + ' כבר נמצא בחקירה, אנא בצע את השינויים הנדרשים',
            icon: 'info',
            customClass: {
                container: classes.duplicateIdsError,
                title: swalClasses.swalTitle,
                content: swalClasses.swalText
            }
        });
    }


    const saveInteractions = async (interactionsDataToSave: InteractionEventDialogData) => {
        if (!checkForDuplicateIdsInContactEvent(interactionsDataToSave.contacts)) {
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
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Update Interaction',
                    step: `launching update interaction request`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                axios.post('/intersections/updateContactEvent', parsedData).then(() => {
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
                    if (error.response.data.includes(duplicateIdsErrorMsg)) {
                        handleDuplicatesError(error.response.data.split(':')[1]);
                    } else {
                        logger.error({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'Update Interaction',
                            step: `got error from server: ${error}`,
                            investigation: epidemiologyNumber,
                            user: userId
                        });
                        handleFailedSave('לא ניתן היה לשמור את השינויים');
                    }
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
                axios.post('/intersections/createContactEvent', parsedData).then((response) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Create Interaction',
                        step: 'created interaction successfully',
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    loadInteractions();
                    closeNewDialog();
                })
                    .catch((error) => {
                        if (error.response.data.includes(duplicateIdsErrorMsg)) {
                            handleDuplicatesError(error.response.data.split(':')[1]);
                        } else {
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
                        }
                    })
            }
        } else {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Create Interaction',
                step: 'Didnt save interactions due to duplicate ids',
                user: userId,
                investigation: epidemiologyNumber
            });
            Swal.fire({
                title: 'שים לב, נמצאו מספרי זיהוי דומים באירוע, אנא בצע את השינויים הדרושים',
                icon: 'info',
                customClass: {
                    container: classes.duplicateIdsError,
                    title: swalClasses.swalTitle,
                    content: swalClasses.swalText
                }
            });
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