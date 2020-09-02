import { Tab } from 'models/Tab';

export interface useInvestigationFormOutcome {
    currentTab: Tab;
    setCurrentTab: (nextTabObj: Tab) => void;
    confirmFinishInvestigation: () => void;
    handleInvestigationFinish: () => void;
};

export interface ClinicalDetailsData {
    isolationStartDate: Date;
    isolationEndDate: Date;
    isolationAddress: string;
    hasTroubleIsolating: boolean;
    troubleIsolatingReason: string;
    symptomsStartDate: Date;
    symptoms: string[];
    backgroundIllnesses: string[];
    hospital: string;
    hospitalStartDate: Date;
    hospitalEndDate: Date;
};
