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
    isolationStartDate: null,
    isolationEndDate: null,
    isolationAddress: '',
    isIsolationProblem: false,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: null,
    symptoms: [''],
    backgroundDeseases: [''],
    hospital: '',
    hospitalizationStartDate: null,
    hospitalizationEndDate: null,
    isPregnant: false,
    investigatedPatientId: -1,
    epidemioligyNumber: -1,
    creator: '',
    lastUpdator: '',
};

const initialClinicalDetailsContext: ClinicalDetailsDataAndSet = {
    clinicalDetailsData: initialClinicalDetails,
    setClinicalDetailsData: () => {}
};

export const clinicalDetailsDataContext = createContext<ClinicalDetailsDataAndSet | EmptyContext>(initialClinicalDetailsContext);
export const ClinicalDetailsDataContextProvider = clinicalDetailsDataContext.Provider;
