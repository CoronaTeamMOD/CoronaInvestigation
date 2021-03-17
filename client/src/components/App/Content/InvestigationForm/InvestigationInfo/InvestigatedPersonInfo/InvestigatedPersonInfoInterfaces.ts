export interface InvestigatedPersonInfoIncome {
    setStaticFieldsChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface InvestigatedPersonInfoOutcome {
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    staticFieldsSubmit: (data: any) => void;
};

export interface StaticFieldsFormInputs {
    fullName: string;
    identificationType: string;
    identityNumber: string;
};