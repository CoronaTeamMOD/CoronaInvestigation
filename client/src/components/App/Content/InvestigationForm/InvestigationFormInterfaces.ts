import { Tab } from 'models/Tab';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: () => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: () => void;
};

export interface useInvestigationFormParameters {
    personalInfoData: personalInfoContextData,
    setPersonalInfoData: React.Dispatch<React.SetStateAction<(personalInfoContextData)>>
}
