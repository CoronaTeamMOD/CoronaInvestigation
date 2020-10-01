import { Dispatch, SetStateAction } from 'react';

import InteractedContact from 'models/InteractedContact';
import InteractedContactFields from 'models/enums/InteractedContact';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

export interface useContactQuestioningParameters {
    setCurrentInteractedContact: Dispatch<SetStateAction<InteractedContact | undefined>>;
    interactedContactsState: interactedContactsContext;
};

export interface useContactQuestioningOutcome {
    saveContact: (interactedContact: InteractedContact) => void;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
    changeIdentificationType: (interactedContact: InteractedContact, booleanValue: boolean) => void;
    openAccordion: (interactedContact: InteractedContact) => void;
    updateNoResponse: (interactedContact: InteractedContact, checked: boolean) => void;
    loadInteractedContacts: () => void;
    saveContactQuestioning: () => Promise<void>;
};
