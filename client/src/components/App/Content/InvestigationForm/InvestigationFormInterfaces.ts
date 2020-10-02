import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { ExposureAndFlightsDetailsAndSet } from 'commons/Contexts/ExposuresAndFlights';

import { Tab } from 'models/Tab';
import TabNames from 'models/enums/TabNames';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: (newTabId: number) => void;
    isButtonDisabled: (tabName: string) => boolean;
    saveCurrentTab: () => Promise<void>;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoContextData;
    exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet;
}
