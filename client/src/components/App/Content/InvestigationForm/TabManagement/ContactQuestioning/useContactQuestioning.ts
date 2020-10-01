import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';

import { useContactQuestioningOutcome, useContactQuestioningParameters } from './ContactQuestioningInterfaces';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const { interactedContactsState, setCurrentInteractedContact } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const saveContact = (interactedContact: InteractedContact) => {
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, false);
        const contacts = [interactedContact];
        axios.post('/contactedPeople/saveAllContacts',
        {
            unSavedContacts: { contacts }
        });
    };

    const saveContactQuestioning = (): Promise<void> => {
        const contacts = interactedContactsState.interactedContacts;

        return axios.post('/contactedPeople/saveAllContacts',
            {
                unSavedContacts: { contacts }
            }
        );
    };

    const loadInteractedContacts = () => {
        interactedContactsState.interactedContacts = [];

        axios.get('/contactedPeople/' + epidemiologyNumber).then((result: any) => {
            result?.data?.data?.allContactedPeople?.nodes?.forEach((contact: any) => {
                interactedContactsState.interactedContacts.push(
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
                        expand: false
                    }
                )
            });
        });
    };

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => {
        setCurrentInteractedContact(interactedContact);
        let contactIndex = interactedContactsState.interactedContacts.findIndex(contact => contact.id === interactedContact.id)
        interactedContactsState.interactedContacts[contactIndex] = { ...interactedContactsState.interactedContacts[contactIndex], [fieldToUpdate]: value };
    };

    const changeIdentificationType = (interactedContact: InteractedContact, booleanValue: boolean) => {
        const newIdentificationType = booleanValue ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
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
