export interface InvestigatedPersonInfoIncome {
    setStaticFieldsChange: React.Dispatch<React.SetStateAction<boolean>>;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
};

export interface InvestigatedPersonInfoOutcome {
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    staticFieldsSubmit: (data: any) => void;
    reopenInvestigation: (epidemiologyNumber: number) => void;
};

export interface StaticFieldsFormInputs {
    fullName: string;
    identificationType: string;
    identityNumber: string;
};