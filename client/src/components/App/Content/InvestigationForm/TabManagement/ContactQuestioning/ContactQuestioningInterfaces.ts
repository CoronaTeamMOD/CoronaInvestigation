import { Dispatch, SetStateAction } from 'react';

import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';

export interface FormInputs {
    form : InteractedContact[]
}


export interface useContactQuestioningParameters {
    id: number;
    allContactedInteractions: InteractedContact[];
    setAllContactedInteractions: Dispatch<SetStateAction<InteractedContact[]>>;
    setFamilyRelationships: Dispatch<SetStateAction<FamilyRelationship[]>>;
    setContactStatuses: Dispatch<SetStateAction<FamilyRelationship[]>>;
    getValues: () => FormInputs;
}

export interface useContactQuestioningOutcome {
    saveContact: (interactedContact: InteractedContact) => boolean;
    loadInteractedContacts: () => void;
    loadFamilyRelationships: () => void;
    loadContactStatuses: () => void;
    checkForSpecificDuplicateIds: (
        idToCheck: string,
        interactedContactId: number
    ) => boolean;
    checkAllContactsForDuplicateIds: () => boolean;
    onSubmit: (data: React.FormEvent) => void;
    parsePerson: (
        person: InteractedContact,
        index: number
    ) => InteractedContact;
}