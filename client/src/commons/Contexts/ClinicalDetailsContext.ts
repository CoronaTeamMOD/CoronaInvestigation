import { createContext } from 'react';

import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export interface ClinicalDetailsDataAndSet {
    clinicalDetailsData: ClinicalDetailsData,
    setClinicalDetailsData: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>
};

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: null,
    isolationEndDate: null,
    isolationAddress: {
        city: '',
        street: '',
        floor: '',
        houseNum: ''
    },
    isIsolationProblem: false,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: null,
    symptoms: [''],
    backgroundDeseases: [''],
    hospital: '',
    hospitalizationStartDate: null,
    hospitalizationEndDate: null,
    isPregnant: false,
};

const initialClinicalDetailsContext: ClinicalDetailsDataAndSet = {
    clinicalDetailsData: initialClinicalDetails,
    setClinicalDetailsData: () => {}
};

export const clinicalDetailsDataContext = createContext<ClinicalDetailsDataAndSet>(initialClinicalDetailsContext);
export const ClinicalDetailsDataContextProvider = clinicalDetailsDataContext.Provider;
