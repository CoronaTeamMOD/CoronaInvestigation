import { Dispatch, SetStateAction } from 'react';

import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/enums/FamilyRelationship';

export interface useContactQuestioningParameters {
    setFamilyRelationships: Dispatch<SetStateAction<FamilyRelationship[] | undefined>>;
};

export interface useContactQuestioningOutcome {
    getAllRelationships: () => void;
    saveContact: (interactedContact: InteractedContact) => void;
};
