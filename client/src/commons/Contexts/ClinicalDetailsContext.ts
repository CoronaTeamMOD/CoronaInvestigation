import { createContext } from 'react';

import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

interface EmptyContext {
    clinicalDetailsData: undefined,
    setClinicalDetailsData: () => void;
};

export interface ClinicalDetailsDataAndSet {
    clinicalDetailsData: ClinicalDetailsData,
    setClinicalDetailsData: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>
};

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: new Date(),
    isolationEndDate: new Date(),
    isolationAddress: '',
    isIsolationProblem: false,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: new Date(),
    symptoms: [''],
    backgroundIllnesses: [''],
    hospital: '',
    hospitalizationStartDate: new Date(),
    hospitalizationEndDate: new Date(),
};

const initialClinicalDetailsContext: ClinicalDetailsDataAndSet = {
    clinicalDetailsData: initialClinicalDetails,
    setClinicalDetailsData: () => {}
};


export const clinicalDetailsDataContext = createContext<ClinicalDetailsDataAndSet | EmptyContext>(initialClinicalDetailsContext);
export const ClinicalDetailsDataContextProvider = clinicalDetailsDataContext.Provider;