export interface InvestigatedPersonInfoIncome {
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
};

export interface InvestigatedPersonInfoOutcome {
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    staticFieldsSubmit: (data: any) => void;
    reopenInvestigation: (epidemiologyNumber: number) => void;
    handleInvestigationFinish: () => void;
    saveInvestigationInfo: () => void;
};

export interface StaticFieldsFormInputs {
    fullName: string;
    identificationType: string;
    identityNumber: string;
};