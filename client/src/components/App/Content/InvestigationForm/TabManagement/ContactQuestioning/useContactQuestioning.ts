import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import { subDays } from 'date-fns';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';

import {useContactQuestioningOutcome, useContactQuestioningParameters} from './ContactQuestioningInterfaces';
import { convertDate, nonSymptomaticPatient, symptomsWithKnownStartDate, symptomsWithUnknownStartDate,} from '../InteractionsTab/useInteractionsTab';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {setAllContactedInteractions, allContactedInteractions, setCurrentInteractedContact} = parameters;
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const saveContact = (interactedContact: InteractedContact) => {
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, false);
        const contacts = [interactedContact];
        axios.post('/contactedPeople/interactedContacts',
            {
                unSavedContacts: {contacts}
            });
    };

    const saveContactQuestioning = (): Promise<void> => {
        const contacts = allContactedInteractions;

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
        axios.get(`/clinicalDetails/coronaTestDate/${epidemiologyNumber}`).then((res: any) => {
            if (res.data !== null) {
                setInteractedContactsByMinimalDate(calculateEarliestDateToInvestigate(
                    convertDate(res.data.coronaTestDate),
                    convertDate(res.data.symptomsStartTime),
                    res.data.doesHaveSymptoms
                ));
            }
        })
    }

    const setInteractedContactsByMinimalDate = (minimalDateToFilter: Date) => {
        let interactedContacts: InteractedContact[] = [];
        axios.get('/contactedPeople/allContacts/' + epidemiologyNumber).then((result: any) => {
            result?.data?.data?.allContactedPeople?.nodes?.forEach((contact: any) => {
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
        }).then(() => {
            setAllContactedInteractions(interactedContacts.filter((contactedPerson: InteractedContact) =>
                new Date(contactedPerson.contactDate) > new Date(minimalDateToFilter)));
        }).catch((err) =>
            console.log(err));
    };

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => {
        setCurrentInteractedContact(interactedContact);
        const contactIndex = allContactedInteractions.findIndex(contact => contact.id === interactedContact.id)
        allContactedInteractions[contactIndex] = {
            ...allContactedInteractions[contactIndex],
            [fieldToUpdate]: value
        };
    };

    const changeIdentificationType = (interactedContact: InteractedContact, value: boolean) => {
        const newIdentificationType = value ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
        updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_TYPE, newIdentificationType);
    };

    const openAccordion = (interactedContact: InteractedContact) => {
        updateInteractedContact(interactedContact, InteractedContactFields.CANT_REACH_CONTACT, false);
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, !interactedContact.expand);
    };

    const updateNoResponse = (interactedContact: InteractedContact, checked: boolean) => {
        updateInteractedContact(interactedContact, InteractedContactFields.CANT_REACH_CONTACT, checked);
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, false);
    };

    return {
        saveContact,
        updateInteractedContact,
        changeIdentificationType,
        openAccordion,
        updateNoResponse,
        loadInteractedContacts,
        saveContactQuestioning,
    };
};

export default useContactQuestioning;
