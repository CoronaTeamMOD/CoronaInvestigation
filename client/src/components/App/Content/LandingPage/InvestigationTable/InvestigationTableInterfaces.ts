import User from 'models/User';
import Investigator from 'models/Investigator';
import InvestigationTableRow from 'models/InvestigationTableRow';

import { TableHeadersNames, IndexedInvestigation } from './InvestigationTablesHeaders';

export interface useInvestigationTableParameters {
    selectedInvestigator: Investigator;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}

export interface useInvestigationTableOutcome {
    tableRows: InvestigationTableRow[];
    onInvestigationRowClick: (epidemiologyNumber: number, currentInvestigationStatus: string) => void;
    convertToIndexedRow: (row: InvestigationTableRow) => { [T in keyof typeof TableHeadersNames]: any };
    getMapKeyByValue: (map: Map<string, User>, value: string) => string;
    onInvestigatorChange: (indexedRow: IndexedInvestigation, newSelectedInvestigator: any, currentSelectedInvestigator: string) => void;
};
