import { Tab } from 'models/Tab';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: (epidemiologyNumber: string) => void;
    handleInvestigationFinish: () => void;
};
