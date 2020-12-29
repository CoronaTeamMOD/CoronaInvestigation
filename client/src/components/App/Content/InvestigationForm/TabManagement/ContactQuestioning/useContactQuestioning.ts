import { AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { differenceInCalendarDays, subDays } from 'date-fns';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import useDuplicateContactId from 'Utils/Contacts/useDuplicateContactId';

import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';

import {
    FormInputs,
    useContactQuestioningOutcome,
    useContactQuestioningParameters,
} from './ContactQuestioningInterfaces';
import {
    nonSymptomaticPatient,
    symptomsWithKnownStartDate,
    symptomsWithUnknownStartDate,
    useDateUtils,
} from 'Utils/DateUtils/useDateUtils';

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
    const { convertDate } = useDateUtils();
    const { checkDuplicateIds } = useDuplicateContactId();

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
            const contactLogger = logger.setup('Saving single contact');
            const contacts = [interactedContact];
            const contactsSavingVariable = {
                unSavedContacts: { contacts },
            };
            contactLogger.info(
                `launching server request with parameter: ${JSON.stringify(
                    contactsSavingVariable
                )}`,
                Severity.LOW
            );
            axios
                .post(
                    '/contactedPeople/interactedContacts',
                    contactsSavingVariable
                )
                .then((response) => {
                    if (response.data?.data?.updateContactPersons) {
                        contactLogger.info(
                            `launching server request with parameter: ${JSON.stringify(
                                contactsSavingVariable
                            )}`,
                            Severity.LOW
                        );
                    }
                })
                .catch((err) => {
                    contactLogger.error(
                        `got the following error from the server: ${err}`,
                        Severity.LOW
                    );
                });
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
            }
            const contactLogger = logger.setup('Saving all contacts');
            contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
            axios.post('/contactedPeople/interactedContacts', contactsSavingVariable)
            .then((response: AxiosResponse<any>) => {
                if (response.data?.data?.updateContactPersons) {
                    contactLogger.info('got respond from the server', Severity.LOW);
                }
            })
            .catch(err => {
                contactLogger.error(`got the following error from the server: ${err}`, Severity.HIGH);
            })
            .finally(() => {
                ContactQuestioningSchema.isValid(originalFormData).then(valid => {
                    setFormState(epidemiologyNumber, id, valid);
                })
            })
        }        
    };

    const calculateEarliestDateToInvestigate = (
        coronaTestDate: Date | null,
        symptomsStartTime: Date | null,
        doesHaveSymptoms: boolean
    ): Date => {
        let earliestDate: Date = new Date();
        if (coronaTestDate !== null) {
            if (doesHaveSymptoms !== null && doesHaveSymptoms) {
                if (symptomsStartTime) {
                    earliestDate = subDays(
                        symptomsStartTime,
                        symptomsWithKnownStartDate
                    );
                } else {
                    earliestDate = subDays(
                        coronaTestDate,
                        symptomsWithUnknownStartDate
                    );
                }
            } else {
                earliestDate = subDays(coronaTestDate, nonSymptomaticPatient);
            }
        }
        return earliestDate;
    };

    const loadInteractedContacts = () => {
        const interactedContactsLogger = logger.setup('Getting corona test date')
        interactedContactsLogger.info(`launching server request with epidemiology number ${epidemiologyNumber}`, Severity.LOW);
        axios.get('/clinicalDetails/coronaTestDate').then((res: any) => {
            if (res.data !== null) {
                interactedContactsLogger.info('got respond from the server that has data', Severity.LOW);
                setInteractedContactsByMinimalDate(calculateEarliestDateToInvestigate(
                    convertDate(res.data.coronaTestDate),
                    convertDate(res.data.symptomsStartTime),
                    res.data.doesHaveSymptoms
                ));
            } else {
                interactedContactsLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).catch(err => {
            interactedContactsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        })
    }

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
        familyRelationshipsLogger.info(
            'launching server request',
            Severity.LOW
        );
        axios
            .get('/contactedPeople/familyRelationships')
            .then((result: any) => {
                if (result?.data?.data?.allFamilyRelationships) {
                    familyRelationshipsLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );
                    setFamilyRelationships(
                        result?.data?.data?.allFamilyRelationships?.nodes
                    );
                } else {
                    familyRelationshipsLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .catch((err) => {
                familyRelationshipsLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            });
    };

    const loadContactStatuses = () => {
        const contactStatusesLogger = logger.setup('Getting contact statuses');
        contactStatusesLogger.info('launching server request', Severity.LOW);
        axios
            .get('/contactedPeople/contactStatuses')
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

    const setInteractedContactsByMinimalDate = (minimalDateToFilter: Date) => {
        const interactedContactsLogger = logger.setup('Getting contacts');
        let interactedContacts: InteractedContact[] = [];
        interactedContactsLogger.info(
            `launching server request with epidemiology number ${epidemiologyNumber}`,
            Severity.LOW
        );
        axios
            .get('/contactedPeople/allContacts/' + epidemiologyNumber)
            .then((result: any) => {
                if (
                    result?.data &&
                    result.headers['content-type'].includes('application/json')
                ) {
                    interactedContactsLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );
                    result.data.forEach((contact: any) => {
                        interactedContacts.push({
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
                            contactedPersonCity: contact.contactedPersonCity,
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
                        });
                    });
                } else {
                    interactedContactsLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .then(() => {
                setAllContactedInteractions(
                    interactedContacts.filter(
                        (contactedPerson: InteractedContact) =>
                            differenceInCalendarDays(
                                new Date(contactedPerson.contactDate),
                                new Date(minimalDateToFilter)
                            ) >= 0
                    )
                );
            })
            .catch((err) => {
                interactedContactsLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            });
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
        saveContactQuestioning(parsedFormData , data);
    };

    const parseFormBeforeSending = (data: FormInputs) => {
        const { form } = data;
        const mappedForm = form.map(
            (person: InteractedContact, index: number) => {
                return parsePerson(person, index);
            }
        );

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
        saveContactQuestioning,
        loadFamilyRelationships,
        loadContactStatuses,
        checkForSpecificDuplicateIds,
        checkAllContactsForDuplicateIds,
        onSubmit,
        parsePerson,
    };
};

export default useContactQuestioning;
