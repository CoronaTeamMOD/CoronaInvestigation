export interface InvestigatedPersonInfoOutcome {
    getPersonAge: (birthDate: Date) => string;
    confirmExitUnfinishedInvestigation: (epidemiologyNumber: number) => void;
    shouldUpdateInvestigationStatus: (investigationInvestigator? : string) => boolean;
};
