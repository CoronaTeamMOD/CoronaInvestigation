import React from 'react';

import Street from 'models/enums/Street';
import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

export interface useClinicalDetailsIncome {
    setHasBackgroundDiseases: React.Dispatch<React.SetStateAction<boolean>>;
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    context: ClinicalDetailsDataAndSet;
    setIsolationCityName: React.Dispatch<React.SetStateAction<string>>;
    setIsolationStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreetsInCity: React.Dispatch<React.SetStateAction<Street[]>>;
};

export interface useClinicalDetailsOutcome {
    hasBackgroundDeseasesToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    getStreetByCity: (cityId: string) => void;
};
