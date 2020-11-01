import { Dispatch, SetStateAction } from 'react';

import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';

export interface useContactQuestioningParameters {
    setCurrentInteractedContact: Dispatch<SetStateAction<InteractedContact | undefined>>;
    allContactedInteractions: InteractedContact[];
    setAllContactedInteractions: Dispatch<SetStateAction<InteractedContact[]>>;
    setFamilyRelationships: Dispatch<SetStateAction<FamilyRelationship[]>>;
    contactStatuses: ContactStatus[];
    setContactStatuses: Dispatch<SetStateAction<FamilyRelationship[]>>;
};

export interface useContactQuestioningOutcome {
    saveContact: (interactedContact: InteractedContact) => void;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
    changeIdentificationType: (interactedContact: InteractedContact, booleanValue: boolean) => void;
    loadInteractedContacts: () => void;
    saveContactQuestioning: () => Promise<void>;
    loadFamilyRelationships: () => void;
    loadContactStatuses: () => void;
};
