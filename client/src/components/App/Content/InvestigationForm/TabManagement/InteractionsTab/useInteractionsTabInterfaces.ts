import React from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
    loadInteractions: () => void;
    getCoronaTestDate: (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>, setInvestigationStartTime: React.Dispatch<React.SetStateAction<Date | null>>) => void;
    getClinicalDetailsSymptoms: (setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | null>>, setDoesHaveSymptoms: React.Dispatch<React.SetStateAction<boolean | any>>) => void;
    handleDeleteContactEvent: (contactEventId: number) => void;
};
