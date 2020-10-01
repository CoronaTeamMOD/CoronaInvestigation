import React from 'react';

import Street from 'models/enums/Street';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export interface useClinicalDetailsIncome {
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    setIsolationCityName: React.Dispatch<React.SetStateAction<string>>;
    setIsolationStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreetsInCity: React.Dispatch<React.SetStateAction<Street[]>>;
    setInitialDBClinicalDetails: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>;
};

export interface useClinicalDetailsOutcome {
    getStreetByCity: (cityId: string) => void;
};
