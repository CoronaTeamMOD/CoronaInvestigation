import React from 'react';

export interface useClinicalDetailsIncome {
    isInIsolation: boolean;
    setIsInIsolation: React.Dispatch<React.SetStateAction<boolean>>;
    hasSymptoms: boolean;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface useClinicalDetailsOutcome {
    isInIsolationToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasSymptomsToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
};
