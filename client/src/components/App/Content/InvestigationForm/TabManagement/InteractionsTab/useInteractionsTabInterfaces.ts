import React from 'react';

import InvolvedContact from 'models/InvolvedContact';
import InteractionsTabSettings from 'models/InteractionsTabSettings';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import { FamilyMembersContext } from 'commons/Contexts/FamilyMembersContext';

export interface useInteractionsTabParameters {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
    setEducationMembers: React.Dispatch<React.SetStateAction<InvolvedContact[]>>;
    familyMembersStateContext: FamilyMembersContext;
    setInteractionsTabSettings: React.Dispatch<React.SetStateAction<InteractionsTabSettings>>;
    completeTabChange: () => void;
};

export interface useInteractionsTabOutcome {
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    handleDeleteContactEvent: (contactEventId: number, areThereFamilyContacts: boolean) => void;
    handleDeleteContactedPerson: (contactedPersonId: number, involvedContactId: number | null) => void;
    saveInvestigaionSettingsFamily: () => void;
};
