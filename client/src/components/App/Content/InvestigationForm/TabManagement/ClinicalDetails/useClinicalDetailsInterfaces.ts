import React from 'react';

import Street from 'models/Street';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export interface useClinicalDetailsIncome {
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    setIsolationCityName: React.Dispatch<React.SetStateAction<string>>;
    setIsolationStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreetsInCity: React.Dispatch<React.SetStateAction<Street[]>>;
    initialDBClinicalDetails: ClinicalDetailsData;
    setInitialDBClinicalDetails: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>;
};

export interface useClinicalDetailsOutcome {
    fetchClinicalDetails: (
        reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
        trigger: (payload?: string | string[]) => Promise<boolean>
    ) => void;
    getStreetByCity: (cityId: string) => void;
    saveClinicalDetails: (clinicalDetails: ClinicalDetailsData, epidemiologyNumber: number, investigatedPatientId: number) => Promise<void>;
};
