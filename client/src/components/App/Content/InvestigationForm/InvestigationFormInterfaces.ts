import { Tab } from 'models/Tab';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    continueToNextTabByClick: () => void;
    confirmFinishInvestigation: () => void;
    handleInvestigationFinish: () => void;
}
