import axios from 'Utils/axios';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';

import { useContactQuestioningOutcome, useContactQuestioningParameters } from './ContactQuestioningInterfaces';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const { setCurrentInteractedContact, interactedContactsState } = parameters;

    const saveContact = (interactedContact: InteractedContact) => {
        updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, false);
        const contacts = [interactedContact];
        axios.post('/contactedPeople/saveAllContacts',
        {
            unSavedContacts: { contacts }
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
    };
};

export default useContactQuestioning;
