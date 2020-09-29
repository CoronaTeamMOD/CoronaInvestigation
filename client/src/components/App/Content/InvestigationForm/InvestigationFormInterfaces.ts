import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

export interface useInvestigationFormOutcome {
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    isButtonDisabled: (tabName: string) => boolean;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoContextData;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
    interactedContactsState: interactedContactsContext;
};
