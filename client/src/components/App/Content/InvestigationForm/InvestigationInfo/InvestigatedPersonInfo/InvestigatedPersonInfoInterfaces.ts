export interface InvestigatedPersonInfoOutcome {
    getPersonAge: (birthDate: Date) => string;
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    handleCantReachInvestigatedCheck: (cantReachInvestigated: boolean) => void
    handleCannotCompleteInvestigationCheck: (cannotCompleteInvestigation: boolean) => void
};

export interface InvestigatedPersonInfoIncome {
    onExitInvestigation: () => Promise<void>;
}
