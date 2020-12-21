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
    loadInteractedContacts: () => void;
    saveContactQuestioning: (formState: InteractedContact[]) => void;
    loadFamilyRelationships: () => void;
    loadContactStatuses: () => void;
    checkForSpecificDuplicateIds: (
        idToCheck: string,
        interactedContactId: number
    ) => boolean;
    checkAllContactsForDuplicateIds: () => boolean;
    onSubmit: (data: any) => void;
    parsePerson: (
        person: InteractedContact,
        index: number
    ) => InteractedContact;
}

export interface FormInputs {
    [InteractedContactFields.CONTACT_STATUS]: number;
    [InteractedContactFields.IDENTIFICATION_TYPE]: number;
    [InteractedContactFields.IDENTIFICATION_NUMBER]: string;
    [InteractedContactFields.BIRTH_DATE]: Date;
    [InteractedContactFields.PHONE_NUMBER]: string;
    [InteractedContactFields.ADDITIONAL_PHONE_NUMBER]: string;
    [InteractedContactFields.FAMILY_RELATIONSHIP]: number;
    [InteractedContactFields.RELATIONSHIP]: string;
    [InteractedContactFields.CONTACTED_PERSON_CITY]: string;
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: boolean;
    [InteractedContactFields.DOES_NEED_ISOLATION]: boolean;
    [InteractedContactFields.DOES_FEEL_GOOD]: boolean;
    [InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES]: boolean;
    [InteractedContactFields.DOES_LIVE_WITH_CONFIRMED]: boolean;
    [InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED]: boolean;
    [InteractedContactFields.DOES_WORK_WITH_CROWD]: boolean;
    [InteractedContactFields.OCCUPATION]: string;
}
