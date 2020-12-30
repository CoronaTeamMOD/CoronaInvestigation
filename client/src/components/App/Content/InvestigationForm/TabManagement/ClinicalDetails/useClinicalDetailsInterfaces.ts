import React from 'react';

import Street from 'models/Street';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import IsolationSource from 'models/IsolationSource';

export interface useClinicalDetailsIncome {
    id: number;
    setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
    didSymptomsDateChangeOccur: boolean;
}

export interface useClinicalDetailsOutcome {
    fetchClinicalDetails: (
        reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
        trigger: (payload?: string | string[]) => Promise<boolean>
    ) => void;
    saveClinicalDetailsAndDeleteContactEvents: (clinicalDetails: ClinicalDetailsData, validationDate: Date, id: number) => void;
    isolationSources: IsolationSource[];
}
