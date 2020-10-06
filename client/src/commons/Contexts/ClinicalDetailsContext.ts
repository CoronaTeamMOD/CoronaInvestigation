import { createContext } from 'react';

import { initDBAddress } from 'models/Address';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export interface ClinicalDetailsDataAndSet {
    clinicalDetailsData: ClinicalDetailsData,
    setClinicalDetailsData: React.Dispatch<React.SetStateAction<ClinicalDetailsData>>
};

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: null,
    isolationEndDate: null,
    isolationAddress: initDBAddress,
    isInIsolation: false,
    isIsolationProblem: false,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: null,
    symptoms: [],
    doesHaveBackgroundDiseases: false,
    backgroundDeseases: [],
    hospital: '',
    hospitalizationStartDate: null,
    hospitalizationEndDate: null,
    isSymptomsStartDateUnknown: false,
    doesHaveSymptoms: false,
    wasHospitalized: false,
    isPregnant: false,
    otherSymptomsMoreInfo: '',
    otherBackgroundDiseasesMoreInfo: ''
};

const initialClinicalDetailsContext: ClinicalDetailsDataAndSet = {
    clinicalDetailsData: initialClinicalDetails,
    setClinicalDetailsData: () => {}
};

export const clinicalDetailsDataContext = createContext<ClinicalDetailsDataAndSet>(initialClinicalDetailsContext);
export const ClinicalDetailsDataContextProvider = clinicalDetailsDataContext.Provider;
