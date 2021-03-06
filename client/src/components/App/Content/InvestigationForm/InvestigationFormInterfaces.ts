import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

export interface useInvestigationFormOutcome {
    confirmFinishInvestigation: (epidemiologyNumber: number, onCancel: () => void) => void;
    handleInvestigationFinish: () => void;
    areThereContacts: boolean;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface useInvestigationFormParameters {
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
};
