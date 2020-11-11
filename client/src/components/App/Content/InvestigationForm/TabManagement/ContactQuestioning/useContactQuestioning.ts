import {AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import {differenceInCalendarDays, subDays} from 'date-fns';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import {Service, Severity} from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import useDuplicateContactId, { duplicateIdsErrorMsg } from 'Utils/vendor/useDuplicateContactId';

import {useContactQuestioningOutcome, useContactQuestioningParameters} from './ContactQuestioningInterfaces';
import {
    convertDate,
    nonSymptomaticPatient,
    symptomsWithKnownStartDate,
    symptomsWithUnknownStartDate,
} from '../InteractionsTab/useInteractionsTab';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {setAllContactedInteractions, allContactedInteractions, setFamilyRelationships, setContactStatuses} = parameters;
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const { handleDuplicateIdsError } = useDuplicateContactId();

    const saveContact = (interactedContact: InteractedContact) => {
        const contacts = [interactedContact];
        const contactsSavingVariable = {
            unSavedContacts: {contacts}
        }
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Saving single contact',
            step: `launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        if(!checkForSpecificDuplicateIds(interactedContact.identificationNumber, interactedContact.id)) {
            interactedContact.identificationNumber = '';
            const changedInteractedContact = allContactedInteractions.findIndex(currContact => currContact.id === interactedContact.id);
            allContactedInteractions.splice(changedInteractedContact, 1, interactedContact);
            setAllContactedInteractions(allContactedInteractions);
            handleDuplicateIdsError(interactedContact.identificationNumber, userId, epidemiologyNumber);
        } else {
            axios.post('/contactedPeople/interactedContacts', contactsSavingVariable).then((response) => {
                if (response.data?.data?.updateContactPersons) {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Saving single contact',
                        step: `launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                } else if (response.data.includes(duplicateIdsErrorMsg)) {
                    handleDuplicateIdsError(response.data.split(':')[1], userId, epidemiologyNumber);
                }
            }).catch(err => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Saving single contact',
                    step: `got the following error from the server: ${err}`,
                    user: userId,
                    investigation: epidemiologyNumber
                })
            });
        }
    }

    const saveContactQuestioning = (): Promise<AxiosResponse<any>> => {
        const contacts = allContactedInteractions;
        const contactsSavingVariable = {
            unSavedContacts: {contacts}
        }
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Saving all contacts',
            step: `launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        return axios.post('/contactedPeople/interactedContacts',
            {
                unSavedContacts: {contacts}
            }
        );
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
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting corona test date',
            step: `launching server request with epidemiology number ${epidemiologyNumber}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get(`/clinicalDetails/coronaTestDate/${epidemiologyNumber}`).then((res: any) => {
            if (res.data !== null) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting corona test date',
                    step: 'got respond from the server that has data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setInteractedContactsByMinimalDate(calculateEarliestDateToInvestigate(
                    convertDate(res.data.coronaTestDate),
                    convertDate(res.data.symptomsStartTime),
                    res.data.doesHaveSymptoms
                ));
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting corona test date',
                    step: 'got respond from the server without data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting corona test date',
                step: `got the following error from the server: ${err}`,
                user: userId,
                investigation: epidemiologyNumber
            })
        })
    }

    const loadFamilyRelationships = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting family relationships',
            step: 'launching server request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/contactedPeople/familyRelationships').then((result: any) => {
            if (result?.data?.data?.allFamilyRelationships) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting family relationships',
                    step: 'got respond from the server that has data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setFamilyRelationships(result?.data?.data?.allFamilyRelationships?.nodes);
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting family relationships',
                    step: 'got respond from the server without data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting family relationships',
                step: `got the following error from the server: ${err}`,
                user: userId,
                investigation: epidemiologyNumber
            });
        });
    }

    const loadContactStatuses = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting contact statuses',
            step: 'launching server request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/contactedPeople/contactStatuses').then((result: any) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting contact statuses',
                    step: 'got respond from the server that has data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setContactStatuses(result.data);
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting contact statuses',
                    step: 'got respond from the server without data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting contact statuses',
                step: `got the following error from the server: ${err}`,
                user: userId,
                investigation: epidemiologyNumber
            });
        });
    }

    const setInteractedContactsByMinimalDate = (minimalDateToFilter: Date) => {
        let interactedContacts: InteractedContact[] = [];
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting contacts',
            step: `launching server request with epidemiology number ${epidemiologyNumber}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/contactedPeople/allContacts/' + epidemiologyNumber).then((result: any) => {
            if (result?.data?.data?.allContactedPeople?.nodes) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting contacts',
                    step: 'got respond from the server that has data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
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
                        }
                    )
                });
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting contacts',
                    step: 'got respond from the server without data',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }).then(() => {
            setAllContactedInteractions(interactedContacts.filter((contactedPerson: InteractedContact) =>
                differenceInCalendarDays(new Date(contactedPerson.contactDate), new Date(minimalDateToFilter)) >= 0
            ))
        }).catch((err) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting contacts',
                step: `got the following error from the server: ${err}`,
                user: userId,
                investigation: epidemiologyNumber
            })
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