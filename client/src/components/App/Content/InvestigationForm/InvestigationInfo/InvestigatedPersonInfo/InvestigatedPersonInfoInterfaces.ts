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