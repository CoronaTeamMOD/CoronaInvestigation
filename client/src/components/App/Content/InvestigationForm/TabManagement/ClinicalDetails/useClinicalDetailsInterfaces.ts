import React from 'react';

export interface useClinicalDetailsIncome {
    setIsInIsolation: React.Dispatch<React.SetStateAction<boolean>>;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>>;
    setHasBackgroundIllnesses: React.Dispatch<React.SetStateAction<boolean>>;
    setWasHospitalized: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface useClinicalDetailsOutcome {
    isInIsolationToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasSymptomsToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasBackgroundIllnessesToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    wasHospitalizedToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
};
