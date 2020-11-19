import {AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import {differenceInCalendarDays, subDays} from 'date-fns';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import useDuplicateContactId from 'Utils/vendor/useDuplicateContactId';
import { setFormState } from 'redux/Form/formActionCreators';

import {useContactQuestioningOutcome, useContactQuestioningParameters} from './ContactQuestioningInterfaces';
import {
    convertDate,
    nonSymptomaticPatient,
    symptomsWithKnownStartDate,
    symptomsWithUnknownStartDate,
} from '../InteractionsTab/useInteractionsTab';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {id, setAllContactedInteractions, allContactedInteractions, setFamilyRelationships, setContactStatuses} = parameters;
    
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { checkDuplicateIds } = useDuplicateContactId();

    const saveContact = (interactedContact: InteractedContact): boolean => {
        if (checkDuplicateIds(allContactedInteractions.map((contact: InteractedContact) => contact.identificationNumber))) {
            return false;
        } else {
            const contactLogger = logger.setup({
                workflow: 'Saving single contact',
                user: userId,
                investigation: epidemiologyNumber
            });
            const contacts = [interactedContact];
            const contactsSavingVariable = {
                unSavedContacts: { contacts }
            }
            contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
            axios.post('/contactedPeople/interactedContacts', contactsSavingVariable).then((response) => {
                if (response.data?.data?.updateContactPersons) {
                    contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
                }
            }).catch(err => {
                contactLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
            });
            return true;
        }
    }

    const saveContactQuestioning = () => {
        if (!checkDuplicateIds(allContactedInteractions.map((contact: InteractedContact) => contact.identificationNumber))) {
            const contactsSavingVariable = {
                unSavedContacts: {contacts: allContactedInteractions}
            }
            const contactLogger = logger.setup({
                workflow: 'Saving all contacts',
                user: userId,
                investigation: epidemiologyNumber
            });
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
            .finally(() => setFormState(epidemiologyNumber, id, true))
        }        
    };

    const calculateEarliestDateToInvestigate = (coronaTestDate: Date | null, symptomsStartTime: Date | null, doesHaveSymptoms: boolean): Date => {
        let earliestDate: Date = new Date();
        if (coronaTestDate !== null) {
            if (doesHaveSymptoms !== null && doesHaveSymptoms) {
                if (symptomsStartTime) {
                    earliestDate = subDays(symptomsStartTime, symptomsWithKnownStartDate);
                } else {
                    earliestDate = subDays(coronaTestDate, symptomsWithUnknownStartDate)
                }
            } else {
                earliestDate = subDays(coronaTestDate, nonSymptomaticPatient)
            }
        }

        return earliestDate;
    }

    const loadInteractedContacts = () => {
        const interactedContactsLogger = logger.setup({
            workflow: 'Getting corona test date',
            user: userId,
            investigation: epidemiologyNumber
        })
        interactedContactsLogger.info(`launching server request with epidemiology number ${epidemiologyNumber}`, Severity.LOW);
        axios.get(`/clinicalDetails/coronaTestDate/${epidemiologyNumber}`).then((res: any) => {
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
        const familyRelationshipsLogger = logger.setup({
            workflow: 'Getting family relationships',
            user: userId,
            investigation: epidemiologyNumber
        })
        familyRelationshipsLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/familyRelationships').then((result: any) => {
            if (result?.data?.data?.allFamilyRelationships) {
                familyRelationshipsLogger.info('got respond from the server that has data', Severity.LOW);
                setFamilyRelationships(result?.data?.data?.allFamilyRelationships?.nodes);
            } else {
                familyRelationshipsLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).catch(err => {
            familyRelationshipsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        });
    }

    const loadContactStatuses = () => {
        const contactStatusesLogger = logger.setup({
            workflow: 'Getting contact statuses',
            user: userId,
            investigation: epidemiologyNumber
        });
        contactStatusesLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/contactStatuses').then((result: any) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                contactStatusesLogger.info('got respond from the server that has data', Severity.LOW);
                setContactStatuses(result.data);
            } else {
                contactStatusesLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).catch(err => {
            contactStatusesLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        });
    }

    const setInteractedContactsByMinimalDate = (minimalDateToFilter: Date) => {
        const interactedContactsLogger = logger.setup({
            workflow: 'Getting contacts',
            user: userId,
            investigation: epidemiologyNumber
        });
        let interactedContacts: InteractedContact[] = [];
        interactedContactsLogger.info(`launching server request with epidemiology number ${epidemiologyNumber}`, Severity.LOW);
        axios.get('/contactedPeople/allContacts/' + epidemiologyNumber).then((result: any) => {
            if (result?.data?.data?.allContactedPeople?.nodes) {
                interactedContactsLogger.info('got respond from the server that has data', Severity.LOW);
                result.data.data.allContactedPeople.nodes.forEach((contact: any) => {
                    interactedContacts.push(
                        {
                            id: contact.id,
                            firstName: contact.personByPersonInfo.firstName,
                            lastName: contact.personByPersonInfo.lastName,
                            phoneNumber: contact.personByPersonInfo.phoneNumber,
                            identificationType: contact.personByPersonInfo.identificationType ? contact.personByPersonInfo.identificationType : IdentificationTypes.ID,
                            identificationNumber: contact.personByPersonInfo.identificationNumber,
                            birthDate: contact.personByPersonInfo.birthDate,
                            additionalPhoneNumber: contact.personByPersonInfo.additionalPhoneNumber,
                            gender: contact.personByPersonInfo.gender,
                            contactDate: contact.contactEventByContactEvent.startTime,
                            contactEvent: contact.contactEventByContactEvent.id,
                            contactType: contact.contactType,
                            contactStatus: contact.contactStatus,
                            extraInfo: contact.extraInfo,
                            relationship: contact.relationship,
                            familyRelationship: contact.familyRelationship,
                            contactedPersonCity: contact.contactedPersonCity,
                            occupation: contact.occupation,
                            doesFeelGood: contact.doesFeelGood ? contact.doesFeelGood : false,
                            doesHaveBackgroundDiseases: contact.doesHaveBackgroundDiseases ? contact.doesHaveBackgroundDiseases : false,
                            doesLiveWithConfirmed: contact.doesLiveWithConfirmed ? contact.doesLiveWithConfirmed : false,
                            doesNeedHelpInIsolation: contact.doesNeedHelpInIsolation ? contact.doesNeedHelpInIsolation : false,
                            repeatingOccuranceWithConfirmed: contact.repeatingOccuranceWithConfirmed ? contact.repeatingOccuranceWithConfirmed : false,
                            doesWorkWithCrowd: contact.doesWorkWithCrowd ? contact.doesWorkWithCrowd : false,
                            doesNeedIsolation: contact.doesNeedIsolation ? contact.doesNeedIsolation : false,
                            creationTime: contact.creationTime,
                        }
                    )
                });
            } else {
                interactedContactsLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).then(() => {
            setAllContactedInteractions(interactedContacts.filter((contactedPerson: InteractedContact) =>
                differenceInCalendarDays(new Date(contactedPerson.contactDate), new Date(minimalDateToFilter)) >= 0
            ))
        }).catch((err) => {
            interactedContactsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        });
    };

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => {
        const contactIndex = allContactedInteractions.findIndex(contact => contact.id === interactedContact.id)
        const updatedContactedInteractions = [...allContactedInteractions];
        const updatedContact: InteractedContact = {
            ...allContactedInteractions[contactIndex],
            [fieldToUpdate]: value
        };
        updatedContactedInteractions.splice(contactIndex, 1, updatedContact);
        setAllContactedInteractions(updatedContactedInteractions);
    };

    const changeIdentificationType = (interactedContact: InteractedContact, value: boolean) => {
        const newIdentificationType = value ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
        updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_TYPE, newIdentificationType);
    };

    const checkForSpecificDuplicateIds = (identificationNumberToCheck: string, interactedContactId: number) => {
        if(Boolean(identificationNumberToCheck)) {
            return (allContactedInteractions.findIndex((contact) => contact.identificationNumber === identificationNumberToCheck
                && contact.id !== interactedContactId) === -1);
        } else {
            return !Boolean(identificationNumberToCheck)
        }
    }

    const checkAllContactsForDuplicateIds = () => {
        const allIdentificationNumbersToCheck = allContactedInteractions.filter(currContact => Boolean(currContact.identificationNumber));
        return (new Set(allIdentificationNumbersToCheck)).size === allIdentificationNumbersToCheck.length;
    }

    return {
        saveContact,
        updateInteractedContact,
        changeIdentificationType,
        loadInteractedContacts,
        saveContactQuestioning,
        loadFamilyRelationships,
        loadContactStatuses,
        checkForSpecificDuplicateIds,
        checkAllContactsForDuplicateIds
    };
};

export default useContactQuestioning;
