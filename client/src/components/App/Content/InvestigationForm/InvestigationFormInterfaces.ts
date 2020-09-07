import { Tab } from 'models/Tab';
import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

export interface useInvestigationFormIncome {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
};

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: (epidemiologyNumber: string) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: () => void;
};
