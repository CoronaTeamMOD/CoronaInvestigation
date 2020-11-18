import React from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabParameters {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
    setDatesToInvestigate: React.Dispatch<React.SetStateAction<Date[]>>;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
    loadInteractions: () => void;
    handleDeleteContactEvent: (contactEventId: number) => void;
    handleDeleteContactedPerson: (contactedPersonId: number, contactEventId: number) => void;
};