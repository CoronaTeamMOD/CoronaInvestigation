import React from 'react';

import Street from 'models/enums/Street';
import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

export interface useClinicalDetailsIncome {
    setIsInIsolation: React.Dispatch<React.SetStateAction<boolean>>;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>>;
    setHasBackgroundDiseases: React.Dispatch<React.SetStateAction<boolean>>;
    setWasHospitalized: React.Dispatch<React.SetStateAction<boolean>>;
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    context: ClinicalDetailsDataAndSet;
    setIsolationCityName: React.Dispatch<React.SetStateAction<string>>;
    setIsolationStreetName: React.Dispatch<React.SetStateAction<string>>;
    streetsInCity: Street[];
    setStreetsInCity: React.Dispatch<React.SetStateAction<Street[]>>;
};

export interface useClinicalDetailsOutcome {
    isInIsolationToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasSymptomsToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    hasBackgroundDeseasesToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    wasHospitalizedToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    getStreetByCity: (cityId: string) => void;
};
