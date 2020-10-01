import React from 'react';
import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface useInteractionsTabInput {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
};

export interface useInteractionsTabOutcome {
    loadInteractions: () => void;
    getCoronaTestDate: (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>, setInvestigationStartTime: React.Dispatch<React.SetStateAction<Date | null>>) => void;
    loadInteractionById: (id: number) => void;
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
    handleDeleteContactEvent: (contactEventId: number) => void;
    addNewInteraction: any;
    updateInteraction: any;
    getClinicalDetails: (setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | null>>, setDoesHaveSymptoms: React.Dispatch<React.SetStateAction<boolean | any>>) => void;
};