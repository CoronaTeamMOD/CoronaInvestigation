import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';
import { personalInfoFormData } from 'models/Contexts/personalInfoContextData';

export interface useInvestigationFormOutcome {
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    isButtonDisabled: (tabName: string) => boolean;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoFormData;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
    interactedContactsState: interactedContactsContext;
};
