export interface InvestigatedPersonInfoOutcome {
    confirmExitUnfinishedInvestigation: () => void;
    getPersonAge: (birthDate: Date) => string;
};