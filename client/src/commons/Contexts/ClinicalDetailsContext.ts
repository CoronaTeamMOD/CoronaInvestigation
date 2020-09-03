import { createContext } from 'react';

import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

interface EmptyContext {
    clinicalDetailsData: undefined,
    setClinicalDetailsData: () => void;
};

export interface ClinicalDetailsDataAndSet {
    clinicalDetailsData: ClinicalDetailsData,
    setClinicalDetailsData: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>
}

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: new Date(),
    isolationEndDate: new Date(),
    isolationAddress: '',
    hasTroubleIsolating: false,
    troubleIsolatingReason: '',
    symptomsStartDate: new Date(),
    symptoms: [''],
    backgroundIllnesses: [''],
    hospital: '',
    hospitalStartDate: new Date(),
    hospitalEndDate: new Date(),
};

const initialClinicalDetailsContext: ClinicalDetailsDataAndSet = {
    clinicalDetailsData: initialClinicalDetails,
    setClinicalDetailsData: () => {}
};


export const clinicalDetailsDataContext = createContext<ClinicalDetailsDataAndSet | EmptyContext>(initialClinicalDetailsContext);
export const ClinicalDetailsDataContextConsumer = clinicalDetailsDataContext.Consumer;
export const ClinicalDetailsDataContextProvider = clinicalDetailsDataContext.Provider; 
