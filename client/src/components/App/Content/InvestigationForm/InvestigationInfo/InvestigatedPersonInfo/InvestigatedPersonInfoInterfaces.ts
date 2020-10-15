export interface InvestigatedPersonInfoOutcome {
    getPersonAge: (birthDate: Date) => string;
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    handleCannotCompleteInvestigationCheck: (cannotCompleteInvestigation: boolean) => void;
};

export interface InvestigatedPersonInfoIncome {
    onExitInvestigation: () => Promise<void>;
};
