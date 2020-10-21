import React from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabParameters {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: () => Date[];
    loadInteractions: () => void;
    getCoronaTestDate: () => void;
    getClinicalDetailsSymptoms: () => void;
    handleDeleteContactEvent: (contactEventId: number) => void;
};
