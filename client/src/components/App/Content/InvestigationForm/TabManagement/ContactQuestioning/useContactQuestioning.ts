import axios  from 'axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useDuplicateContactId from 'Utils/Contacts/useDuplicateContactId';

import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import {
    FormInputs,
    useContactQuestioningOutcome,
    useContactQuestioningParameters,
} from './ContactQuestioningInterfaces';
    
const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {
        id,
        setAllContactedInteractions,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses,
        getValues,
    } = parameters;
    
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const datesToInvestigate = useSelector<StoreStateType, Date[]>(state => state.investigation.datesToInvestigate);

    const { checkDuplicateIds } = useDuplicateContactId();
    const { alertError } = useCustomSwal();

    const createSaveContactRequest = (contactsSavingVariable: { unSavedContacts: { contacts: InteractedContact[] } },
                                    workflowName: string) => {
        const contactLogger = logger.setup(workflowName);

        contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
        setIsLoading(true);
        return axios.post('/contactedPeople/interactedContacts', contactsSavingVariable)
            .then((response) => {
                if (response.data?.data?.updateContactPersons) {
                    contactLogger.info('got response from the server', Severity.LOW);
                }
            })
            .catch((err) => {
                contactLogger.error(`got the following error from the server: ${err}`, Severity.HIGH);
                alertError('חלה שגיאה בשמירת הנתונים');
            })
            .finally(() => setIsLoading(false));
    };

    const saveContact = (interactedContact: InteractedContact): boolean => {
        if (
            checkDuplicateIds(
                allContactedInteractions.map(
                    (contact: InteractedContact) => contact.identificationNumber
                )
            )
        ) {
            return false;
        } else {
            const contacts = [interactedContact];
            const contactsSavingVariable = {
                unSavedContacts: { contacts },
            };

            createSaveContactRequest(contactsSavingVariable, 'Saving single contact');
            return true;
        }
    };

    const saveContactQuestioning = (parsedFormData: InteractedContact[] , originalFormData: FormInputs) => {
        if (
            !checkDuplicateIds(
                parsedFormData.map(
                    (contact: InteractedContact) => contact.identificationNumber
                )
            )
        ) {
            const contactsSavingVariable = {
                unSavedContacts: {contacts: parsedFormData}
            };

            createSaveContactRequest(contactsSavingVariable, 'Saving all contacts')
            .finally(() => {
                ContactQuestioningSchema.isValid(originalFormData).then(valid => {
                    setFormState(epidemiologyNumber, id, valid);
                })
            })
        }        
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
        axios.get(`/contactedPeople/allContacts/${epidemiologyNumber}/${new Date(minimalDate)}`)
            .then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    interactedContactsLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );
                    const interactedContacts: InteractedContact[] = result.data.map((contact: any) =>
                        ({
                            id: contact.id,
                            firstName: contact.personByPersonInfo.firstName,
                            lastName: contact.personByPersonInfo.lastName,
                            phoneNumber: contact.personByPersonInfo.phoneNumber,
                            identificationType: contact.personByPersonInfo
                                .identificationType
                                ? contact.personByPersonInfo.identificationType
                                : IdentificationTypes.ID,
                            identificationNumber:
                                contact.personByPersonInfo.identificationNumber,
                            birthDate: contact.personByPersonInfo.birthDate,
                            additionalPhoneNumber:
                                contact.personByPersonInfo
                                    .additionalPhoneNumber,
                            gender: contact.personByPersonInfo.gender,
                            contactDate:
                                contact.contactEventByContactEvent.startTime,
                            contactEvent: contact.contactEventByContactEvent.id,
                            contactType: contact.contactType,
                            contactStatus: contact.contactStatus,
                            extraInfo: contact.extraInfo,
                            relationship: contact.relationship,
                            familyRelationship: contact.familyRelationship,
                            isolationAddress: contact.isolationAddress,
                            occupation: contact.occupation,
                            doesFeelGood: contact.doesFeelGood
                                ? contact.doesFeelGood
                                : false,
                            doesHaveBackgroundDiseases: contact.doesHaveBackgroundDiseases
                                ? contact.doesHaveBackgroundDiseases
                                : false,
                            doesLiveWithConfirmed: contact.doesLiveWithConfirmed
                                ? contact.doesLiveWithConfirmed
                                : false,
                            doesNeedHelpInIsolation: contact.doesNeedHelpInIsolation
                                ? contact.doesNeedHelpInIsolation
                                : false,
                            repeatingOccuranceWithConfirmed: contact.repeatingOccuranceWithConfirmed
                                ? contact.repeatingOccuranceWithConfirmed
                                : false,
                            doesWorkWithCrowd: contact.doesWorkWithCrowd
                                ? contact.doesWorkWithCrowd
                                : false,
                            doesNeedIsolation: contact.doesNeedIsolation
                                ? contact.doesNeedIsolation
                                : false,
                            creationTime: contact.creationTime,
                            involvementReason: contact.involvementReason,
                            involvedContactId: contact.involvedContactId,
                        })
                    )

                    setAllContactedInteractions(interactedContacts);
                } else {
                    interactedContactsLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .catch((err) => {
                interactedContactsLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            })
            .finally(() => setIsLoading(false));
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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = getValues();
        const parsedFormData = parseFormBeforeSending(data as FormInputs);
        parsedFormData && saveContactQuestioning(parsedFormData , data);
    };

    const parseFormBeforeSending = (data: FormInputs) => {
        const { form } = data;
        const mappedForm = form?.map(
            (person: InteractedContact, index: number) => {
                return parsePerson(person, index);
            }
        ) || [];

        return mappedForm;
    };

    /*
     * The form's state only contains variables that can be edited
     * however, the server expects fields that cannot be edited to be sent (i.e first name)
     * so im parsing the data and adding all of those fields before sending them
     */
    const parsePerson = (person: InteractedContact, index: number) => {
        let updatedPerson = person;
        updatedPerson.contactDate = allContactedInteractions[index].contactDate;
        updatedPerson.contactEvent =
            allContactedInteractions[index].contactEvent;
        updatedPerson.contactType = allContactedInteractions[index].contactType;
        updatedPerson.creationTime =
            allContactedInteractions[index].creationTime;
        updatedPerson.extraInfo = allContactedInteractions[index].extraInfo;
        updatedPerson.firstName = allContactedInteractions[index].firstName;
        updatedPerson.gender = allContactedInteractions[index].gender;
        updatedPerson.id = allContactedInteractions[index].id;
        updatedPerson.involvedContactId =
            allContactedInteractions[index].involvedContactId;
        updatedPerson.involvementReason =
            allContactedInteractions[index].involvementReason;
        updatedPerson.lastName = allContactedInteractions[index].lastName;

        return updatedPerson;
    };

    return {
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
        checkForSpecificDuplicateIds,
        checkAllContactsForDuplicateIds,
        onSubmit,
        parsePerson,
    };
};

export default useContactQuestioning;
