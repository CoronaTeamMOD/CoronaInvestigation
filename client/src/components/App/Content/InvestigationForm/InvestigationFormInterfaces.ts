import { Tab } from 'models/Tab';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';
import { PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContext from 'models/enums/PersonalInfoDataContextFields';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    handleSwitchTab: () => void;
};

export interface useInvestigationFormParameters {
    clinicalDetailsVariables: ClinicalDetailsDataAndSet;
    personalInfoData: personalInfoContextData;
    setPersonalInfoData: React.Dispatch<React.SetStateAction<(personalInfoContextData)>>;
}
