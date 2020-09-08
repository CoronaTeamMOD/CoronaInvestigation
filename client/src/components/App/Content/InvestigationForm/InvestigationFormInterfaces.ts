import { Tab } from 'models/Tab';
import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

export interface useInvestigationFormIncome {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
};

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: (investigatedPatientId: number, epidemioligyNumber: number, creator: string, lastUpdator: string) => void;
};
