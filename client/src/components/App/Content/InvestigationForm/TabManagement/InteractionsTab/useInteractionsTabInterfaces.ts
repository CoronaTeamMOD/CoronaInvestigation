import React from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabParameters {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
    loadInteractions: () => void;
    getCoronaTestDate: (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>) => void;
    getClinicalDetailsSymptoms: (setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | null>>, setDoesHaveSymptoms: React.Dispatch<React.SetStateAction<boolean | any>>) => void;
    handleDeleteContactEvent: (contactEventId: number) => void;
    handleDeleteContactedPerson: (contactedPersonId: number, contactEventId: number) => void;
    checkForDuplicateInteractions: (idToCheck: string, contactId: number) => boolean;
};