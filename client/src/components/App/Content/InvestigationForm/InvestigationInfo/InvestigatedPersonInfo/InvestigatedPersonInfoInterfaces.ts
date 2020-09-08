export interface InvestigatedPersonInfoOutcome {
    getPersonAge: (birthDate: Date) => string;
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number, cantReachInvestigated: boolean) => void;
    handleCantReachInvestigatedCheck: (cantReachInvestigated: boolean) => void
};
