import { MutableRefObject } from 'react';

import User from 'models/User';
import Desk from 'models/Desk';
import County from 'models/County';
import Investigator from 'models/Investigator';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { IndexedInvestigation, IndexedInvestigationData } from './InvestigationTablesHeaders';

export interface useInvestigationTableParameters {
    selectedInvestigator: Investigator;
    currentPage: number;
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
    setAllUsersOfCurrCounty: React.Dispatch<React.SetStateAction<Map<string, User>>>;
    setAllCounties: React.Dispatch<React.SetStateAction<Map<number, County>>>;
    setAllStatuses: React.Dispatch<React.SetStateAction<InvestigationMainStatus[]>>;
    setAllDesks: React.Dispatch<React.SetStateAction<Desk[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setAllGroupedInvestigations: React.Dispatch<React.SetStateAction<Map<string, InvestigationTableRow[]>>>;
    investigationColor: MutableRefObject<Map<string, string>>;
}

export interface useInvestigationTableOutcome {
    tableRows: InvestigationTableRow[];
    fetchTableData: () => void;
    onInvestigationRowClick: (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => void;
    convertToIndexedRow: (row: InvestigationTableRow) => { [T in keyof IndexedInvestigationData]: any };
    setTableRows: React.Dispatch<React.SetStateAction<InvestigationTableRow[]>>;
    getUserMapKeyByValue: (map: Map<string, User>, value: string) => string;
    getCountyMapKeyByValue: (map: Map<number, County>, value: string) => number;
    onInvestigatorChange: (indexedRow: IndexedInvestigation, newSelectedInvestigator: any, currentSelectedInvestigator: string) => Promise<void>;
    onCountyChange: (indexedRow: IndexedInvestigation, newSelectedCountyId: {id: number, value: County} | null) => Promise<void>;
    onDeskChange: (indexedRow: IndexedInvestigation, newSelectedDesk: Desk | null) => Promise<void>;
    getTableCellStyles: (rowIndex: number, cellKey: string) => string[];
    sortInvestigationTable: (orderByValue: string) => void;
    onOk: () => void;
    onCancel: () => void;
    snackbarOpen: boolean;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
    totalCount: number;
    handleFilterChange: (filterBy: any) => void;
    unassignedInvestigationsCount: number;
    fetchInvestigationsByGroupId: (groupId: string) => void;
};
