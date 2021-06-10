import { Dispatch, SetStateAction } from 'react';

import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

export interface FormInputs {
    form : InteractedContact[]
}
export interface useContactQuestioningParameters {
    id: number;
    allContactedInteractions: GroupedInteractedContact[];
    setAllContactedInteractions: Dispatch<SetStateAction<GroupedInteractedContact[]>>;
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
        person: GroupedInteractedContact,
        index: number
    ) => InteractedContact;
    getRulerApiData: (parameterns: JSON) => void;
    getRulerApiDataFromServer: () => void;
}