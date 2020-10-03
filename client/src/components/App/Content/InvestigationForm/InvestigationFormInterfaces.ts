import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

import { Tab } from 'models/Tab';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: (newTabId: number) => void;
    isButtonDisabled: (tabName: string) => boolean;
    saveCurrentTab: () => Promise<void>;
    areThereContacts: boolean;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoContextData;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
    interactedContactsState: interactedContactsContext;
};
