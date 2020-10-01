import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

export interface useInvestigationFormOutcome {
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
    interactedContactsState: interactedContactsContext;
};
