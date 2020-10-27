import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { subDays, differenceInCalendarDays } from 'date-fns';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';

import {useContactQuestioningOutcome, useContactQuestioningParameters} from './ContactQuestioningInterfaces';
import { convertDate, nonSymptomaticPatient, symptomsWithKnownStartDate, symptomsWithUnknownStartDate,} from '../InteractionsTab/useInteractionsTab';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {setAllContactedInteractions, allContactedInteractions, setCurrentInteractedContact} = parameters;

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const saveContact = (interactedContact: InteractedContact) => {
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, false);
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
        axios.post('/contactedPeople/interactedContacts', contactsSavingVariable).then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving single contact',
                step: `launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`,
                user: userId,
                investigation: epidemiologyNumber
            });
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
    };

    const saveContactQuestioning = (): Promise<void> => {
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
                            cantReachContact: contact.cantReachContact ? contact.cantReachContact : false,
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
                            expand: false,
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
        }).catch((err) =>{
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

    const updateCantReachInteractedContact = (interactedContact: InteractedContact, value: boolean) => {
        setCurrentInteractedContact(interactedContact);
        const contactIndex = allContactedInteractions.findIndex(contact => contact.id === interactedContact.id)
        const updatedContactedInteractions = [...allContactedInteractions];
        const updatedContact : InteractedContact = {
            ...allContactedInteractions[contactIndex],
            [InteractedContactFields.CANT_REACH_CONTACT]: value,
            [InteractedContactFields.EXPAND]: value ? false : allContactedInteractions[contactIndex][InteractedContactFields.EXPAND]
        };
        setCurrentInteractedContact(updatedContact);
        updatedContactedInteractions.splice(contactIndex, 1, updatedContact);
        setAllContactedInteractions(updatedContactedInteractions);
    };

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => {
        setCurrentInteractedContact(interactedContact);
        const contactIndex = allContactedInteractions.findIndex(contact => contact.id === interactedContact.id)
        const updatedContactedInteractions = [...allContactedInteractions];
        const updatedContact : InteractedContact = {
            ...allContactedInteractions[contactIndex],
            [fieldToUpdate]: value
        };
        setCurrentInteractedContact(updatedContact);
        updatedContactedInteractions.splice(contactIndex, 1, updatedContact);
        setAllContactedInteractions(updatedContactedInteractions);
    };

    const changeIdentificationType = (interactedContact: InteractedContact, value: boolean) => {
        const newIdentificationType = value ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
        updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_TYPE, newIdentificationType);
    };

    return {
        saveContact,
        updateInteractedContact,
        changeIdentificationType,
        loadInteractedContacts,
        saveContactQuestioning,
        updateCantReachInteractedContact
    };
};

export default useContactQuestioning;
