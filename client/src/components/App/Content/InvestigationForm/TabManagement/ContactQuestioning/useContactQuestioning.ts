import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { store } from 'redux/store';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import { getInteractedContacts } from 'redux/InteractedContacts/interactedContactsActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import GroupedInteractedContact, { GroupedInteractedContactEvent } from 'models/ContactQuestioning/GroupedInteractedContact';
import { updateInteractedContacts } from 'httpClient/InteractedContacts/interactedContacts';

import {
    useContactQuestioningOutcome,
    useContactQuestioningParameters,
} from './ContactQuestioningInterfaces';

export const SIZE_OF_CONTACTS = 10;

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {
        id,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses
    } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const datesToInvestigate = useSelector<StoreStateType, Date[]>(state => state.investigation.datesToInvestigate);
    const isViewMode = useSelector<StoreStateType, boolean>(state => state.investigation.isViewMode);
    const interactedContacts = useSelector<StoreStateType, GroupedInteractedContact[]>(state => state.interactedContacts.interactedContacts);
    const dispatch = useDispatch();

    const { alertError } = useCustomSwal();

    const createSaveContactRequest = async (contactsSavingVariable: { unSavedContacts: { contacts: InteractedContact[] } },
        workflowName: string) => {
        const contactLogger = logger.setup(workflowName);

        contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
        setIsLoading(true);
        await updateInteractedContacts(contactsSavingVariable.unSavedContacts.contacts);
        setIsLoading(false);
    };

    const getRulerApiDataFromServer = async (ids: any[]) => {
        const RulerCheckColorRequestParameters = {
            "RulerCheckColorRequest": {
                "MOHHeader": {
                    "ActivationID": "1",
                    "CustID": "23",
                    "AppID": "123",
                    "SiteID": "2",
                    "InterfaceID": "Ruler"
                },
                "Ids": ids
            }
        }

        const rulerLogger = logger.setup('client ruler logger setup');
        rulerLogger.info(`launching server request with parameter: ${JSON.stringify(RulerCheckColorRequestParameters)}`, Severity.LOW);
        setIsLoading(true);
        return await axios.post('/ruler/rulerapi', RulerCheckColorRequestParameters, { timeout: 5000 })
            .then((response: any) => {
                if (response.data?.ColorData) {
                    rulerLogger.info('got response from the ruler server', Severity.LOW);
                    return response.data;
                } else {
                    alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
                }
            })
            .catch((err) => {
                rulerLogger.error(`got the following error from the ruler server: ${err}`, Severity.HIGH);
                alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
                return err;
            })
            .finally(() => setIsLoading(false));
    };

    const saveContact = (interactedContact: InteractedContact): boolean => {
        const contacts = [interactedContact];
        const contactsSavingVariable = {
            unSavedContacts: { contacts },
        };

        createSaveContactRequest(contactsSavingVariable, 'Saving single contact');
        return true;
    };

    const saveContactQuestioning = (data: InteractedContact[]) => {
        const contactsSavingVariable = {
            unSavedContacts: { contacts: data }
        };

        createSaveContactRequest(contactsSavingVariable, 'Saving all contacts')
            .finally(() => {
                validateForm();
            });
    };

    const loadFamilyRelationships = () => {
        const familyRelationshipsLogger = logger.setup('Getting family relationships')
        familyRelationshipsLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/familyRelationships').then((result: any) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                familyRelationshipsLogger.info('got respond from the server that has data', Severity.LOW);
                setFamilyRelationships(result?.data);
            } else {
                familyRelationshipsLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).catch(err => {
            familyRelationshipsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        });
    };

    const loadContactStatuses = () => {
        const contactStatusesLogger = logger.setup('Getting contact statuses');
        contactStatusesLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/contactStatuses')
            .then((result: any) => {
                if (
                    result?.data &&
                    result.headers['content-type'].includes('application/json')
                ) {
                    contactStatusesLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );
                    setContactStatuses(result.data);
                } else {
                    contactStatusesLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .catch((err) => {
                contactStatusesLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            });
    };

    const loadInteractedContacts = () => {
        const interactedContactsLogger = logger.setup('Getting contacts');
        interactedContactsLogger.info(
            `launching server request with epidemiology number ${epidemiologyNumber}`,
            Severity.LOW
        );
        setIsLoading(true);
        const minimalDate = datesToInvestigate.slice(-1)[0];

        dispatch(getInteractedContacts(minimalDate));
    };

    const checkForSpecificDuplicateIds = (
        identificationNumberToCheck: string,
        interactedContactId: number
    ) => {
        if (Boolean(identificationNumberToCheck)) {
            return (
                allContactedInteractions.findIndex(
                    (contact) =>
                        contact.identificationNumber ===
                        identificationNumberToCheck &&
                        contact.id !== interactedContactId
                ) === -1
            );
        } else {
            return !Boolean(identificationNumberToCheck);
        }
    };

    const checkAllContactsForDuplicateIds = () => {
        const allIdentificationNumbersToCheck = allContactedInteractions.filter(
            (currContact) => Boolean(currContact.identificationNumber)
        );
        return (
            new Set(allIdentificationNumbersToCheck).size ===
            allIdentificationNumbersToCheck.length
        );
    };
    const areThereDuplicateIds = (data: GroupedInteractedContact[]) => {
        const ids = data
            .filter(person => {
                const { identificationNumber, identificationType } = person;
                return identificationNumber && identificationType;
            }).map(person => {
                return `${person.identificationNumber}-${person.identificationType}`
            });

        return ids.length !== new Set(ids).size;

    };


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedFormData = parseFormBeforeSending(interactedContacts);
        if (!areThereDuplicateIds(interactedContacts) && !isViewMode) {
            saveContactQuestioning(parsedFormData);
        } 
        else if(isViewMode){
            validateForm();
        }
        else {
            alertError('ישנם תזים כפולים בטופס- לא ניתן לשמור');
        }
    };

    const parseFormBeforeSending = (data: GroupedInteractedContact[]) => {
        const mappedForm = data.map(
            (person: InteractedContact) => {
                return parsePerson(person);
            }
        ) || [];

        return mappedForm;
    };

    const validateForm = () => {
        const formStates = store.getState().interactedContacts.formState;
        const invalidContacts = formStates.filter(obj => obj.isValid === false);
        if (invalidContacts.length > 0)
            setFormState(epidemiologyNumber, id, false);
        else
            setFormState(epidemiologyNumber, id, true);
    };

    /*
     * The form's state only contains variables that can be edited
     * however, the server expects fields that cannot be edited to be sent (i.e first name)
     * so im parsing the data and adding all of those fields before sending them
     */
    const parsePerson = (person: InteractedContact) => {
        let updatedPerson = person || {};
        updatedPerson.identificationType = (person.identificationType?.id || person.identificationType) as any;
        if (updatedPerson.isolationAddress) {
            updatedPerson.isolationAddress.city = (person.isolationAddress.city?.id || person.isolationAddress.city) as any;
            updatedPerson.isolationAddress.street = (person.isolationAddress.street?.id || person.isolationAddress.street) as any;
        }
        return updatedPerson;
    };

    const groupSimilarContactedPersons = (interactedContacts: InteractedContact[]) => {
        let contactsMap = new Map<number, GroupedInteractedContact>();
        interactedContacts.forEach(contact => {
            const { personInfo } = contact;
            if (personInfo) {
                const existingContactType = (contactsMap.get(personInfo)?.contactType);
                const newEvent: GroupedInteractedContactEvent = {
                    date: contact.contactDate,
                    name: contact.placeName || '',
                    contactType: +contact.contactType
                }
                const newEventArr = (contactsMap.get(personInfo)?.contactEvents || []).concat(newEvent);

                contactsMap.set(personInfo, {
                    ...contact,
                    contactType: (existingContactType && +existingContactType === 1) ? existingContactType : contact.contactType,
                    contactEvents: newEventArr,
                });
            }
        });

        return Array.from(contactsMap).map(contact => contact[1]);
    }

    return {
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
        checkForSpecificDuplicateIds,
        checkAllContactsForDuplicateIds,
        onSubmit,
        parsePerson,
        getRulerApiDataFromServer
    };
};

export default useContactQuestioning;
