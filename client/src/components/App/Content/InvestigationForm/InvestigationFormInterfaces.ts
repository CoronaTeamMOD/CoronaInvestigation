import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

import { Tab } from 'models/Tab';
import { personalInfoFormData } from 'models/Contexts/personalInfoContextData';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: () => void;
    isButtonDisabled: (tabName: string) => boolean;
    saveCurrentTab: () => Promise<void>;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoFormData;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
}
