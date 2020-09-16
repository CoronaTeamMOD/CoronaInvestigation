import React from 'react';
import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
};

export interface useInteractionsTabOutcome {
    loadInteractions: () => void;
    getCoronaTestDate: (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>, setInvestigationStartTime: React.Dispatch<React.SetStateAction<Date | null>>) => void;
    addNewInteraction: (addedInteraction: Interaction) => void;
    updateInteraction: (updatedInteraction: Interaction) => void;
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null, investigationStartTime: Date | null) => Date[];
};