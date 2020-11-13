import { Dispatch, SetStateAction } from 'react';

import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';

export interface useContactQuestioningParameters {
    id: number;
    allContactedInteractions: InteractedContact[];
    setAllContactedInteractions: Dispatch<SetStateAction<InteractedContact[]>>;
    setFamilyRelationships: Dispatch<SetStateAction<FamilyRelationship[]>>;
    setContactStatuses: Dispatch<SetStateAction<FamilyRelationship[]>>;
}

export interface useContactQuestioningOutcome {
    saveContact: (interactedContact: InteractedContact) => boolean;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
    changeIdentificationType: (interactedContact: InteractedContact, booleanValue: boolean) => void;
    loadInteractedContacts: () => void;
    saveContactQuestioning: () => void;
    loadFamilyRelationships: () => void;
    loadContactStatuses: () => void;
    checkForSpecificDuplicateIds: (idToCheck: string, interactedContactId: number) => boolean;
    checkAllContactsForDuplicateIds: () => boolean;
}