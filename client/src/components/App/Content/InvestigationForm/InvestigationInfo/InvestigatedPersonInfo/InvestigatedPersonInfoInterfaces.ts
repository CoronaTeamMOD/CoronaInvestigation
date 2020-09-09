export interface InvestigatedPersonInfoOutcome {
    getPersonAge: (birthDate: Date) => string;
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: string, cantReachInvestigated: boolean) => void;
    handleCantReachInvestigatedCheck: (cantReachInvestigated: boolean) => void
};