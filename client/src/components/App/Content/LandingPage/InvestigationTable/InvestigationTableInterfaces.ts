import User from 'models/User';
import County from 'models/County';
import Investigator from 'models/Investigator';
import InvestigationTableRow from 'models/InvestigationTableRow';
import Desk from 'models/Desk';

import { IndexedInvestigation, IndexedInvestigationData } from './InvestigationTablesHeaders';
import { MutableRefObject } from 'react';

export interface useInvestigationTableParameters {
    selectedInvestigator: Investigator;
    checkedRowsIds: number[];
    currentPage: number;
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
    setAllUsersOfCurrCounty: React.Dispatch<React.SetStateAction<Map<string, User>>>;
    setAllCounties: React.Dispatch<React.SetStateAction<Map<number, County>>>;
    setAllStatuses: React.Dispatch<React.SetStateAction<string[]>>;
    setAllDesks: React.Dispatch<React.SetStateAction<Desk[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setAllGroupedInvestigations: React.Dispatch<React.SetStateAction<Map<string, InvestigationTableRow[]>>>;
    coloredGroupedRows: MutableRefObject<number[]>;
    investigationColor: MutableRefObject<Map<string, string>>;
}

export interface useInvestigationTableOutcome {
    tableRows: InvestigationTableRow[];
    onInvestigationRowClick: (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => void;
    convertToIndexedRow: (row: InvestigationTableRow) => { [T in keyof IndexedInvestigationData]: any };
    setTableRows: React.Dispatch<React.SetStateAction<InvestigationTableRow[]>>;
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
    totalCount: number;
    handleFilterChange: (filterBy: any) => void;
    unassignedInvestigationsCount: number;
    getInvestigationsByGroupId: (groupId: string) => void;
};
