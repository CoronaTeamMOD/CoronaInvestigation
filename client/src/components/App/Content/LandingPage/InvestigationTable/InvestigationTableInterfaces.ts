import User from 'models/User';
import County from 'models/County';
import Investigator from 'models/Investigator';
import InvestigationTableRow from 'models/InvestigationTableRow';
import Desk from 'models/Desk';

import { IndexedInvestigation, IndexedInvestigationData} from './InvestigationTablesHeaders';

export interface useInvestigationTableParameters {
    selectedInvestigator: Investigator;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
    setAllUsersOfCurrCounty: React.Dispatch<React.SetStateAction<Map<string, User>>>;
    setAllCounties: React.Dispatch<React.SetStateAction<Map<number, County>>>;
    setAllStatuses: React.Dispatch<React.SetStateAction<string[]>>;
    setAllDesks: React.Dispatch<React.SetStateAction<Desk[]>>;
}

export interface useInvestigationTableOutcome {
    tableRows: InvestigationTableRow[];
    onInvestigationRowClick: (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => void;
    convertToIndexedRow: (row: InvestigationTableRow) => { [T in keyof IndexedInvestigationData]: any };
    getUserMapKeyByValue: (map: Map<string, User>, value: string) => string;
    getCountyMapKeyByValue: (map: Map<number, County>, value: string) => number;
    onInvestigatorChange: (indexedRow: IndexedInvestigation, newSelectedInvestigator: any, currentSelectedInvestigator: string) => void;
    onCountyChange: (indexedRow: IndexedInvestigation, newSelectedCountyId: any, currentSelectedCounty: string) => void;
    onDeskChange: (indexedRow: IndexedInvestigation, newSelectedDesk: any, currentSelectedDesk: string) => void;
    getTableCellStyles: (rowIndex: number, cellKey: string) => string[];
    sortInvestigationTable: (orderByValue: string) => void;
    onOk: () => void;
    onCancel: () => void;
    snackbarOpen: boolean;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
};
