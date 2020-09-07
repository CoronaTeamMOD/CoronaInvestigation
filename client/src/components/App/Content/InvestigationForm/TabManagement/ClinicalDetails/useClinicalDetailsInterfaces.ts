import React from 'react';

export interface useClinicalDetailsIncome {
    setIsInIsolation: React.Dispatch<React.SetStateAction<boolean>>;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>>;
    setHasBackgroundDiseases: React.Dispatch<React.SetStateAction<boolean>>;
    setWasHospitalized: React.Dispatch<React.SetStateAction<boolean>>;
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
};

export interface useClinicalDetailsOutcome {
    isInIsolationToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasSymptomsToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasBackgroundIllnessesToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    wasHospitalizedToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
};
