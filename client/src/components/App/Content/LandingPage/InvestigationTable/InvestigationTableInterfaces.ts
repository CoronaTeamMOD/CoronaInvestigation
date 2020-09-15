import InvestigationTableRow from 'models/InvestigationTableRow';

export interface useInvestigationTableOutcome {
    tableRows: InvestigationTableRow[];
    onInvestigationRowClick: (epidemiologyNumber: number, currentInvestigationStatus: string) => void;
};
