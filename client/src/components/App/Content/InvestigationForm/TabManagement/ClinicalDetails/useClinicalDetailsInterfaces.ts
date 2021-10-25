import React from 'react';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import IsolationSource from 'models/IsolationSource';

export interface useClinicalDetailsIncome {
    id: number;
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    didSymptomsDateChangeOccur: boolean;
}

export interface useClinicalDetailsOutcome {
    fetchClinicalDetails: () => void;
    saveClinicalDetailsAndDeleteContactEvents: (clinicalDetails: ClinicalDetailsData, id: number) => void;
    isolationSources: IsolationSource[];
}
