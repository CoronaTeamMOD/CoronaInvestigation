import { MutableRefObject } from 'react';

import User from 'models/User';
import Desk from 'models/Desk';
import County from 'models/County';
import Investigator from 'models/Investigator';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigatorOption from 'models/InvestigatorOption';

import { IndexedInvestigation, IndexedInvestigationData } from './InvestigationTablesHeaders';

export type StatusFilter = number[];
export type DeskFilter = number[];

export interface HistoryState {
    filterRules?: any;
    statusFilter?: StatusFilter;
    deskFilter?: DeskFilter;
}

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
    getUserMapKeyByValue: (map: Map<string, User>, value: string) => string;
    getCountyMapKeyByValue: (map: Map<number, County>, value: string) => number;
    changeCounty: (indexedRow: IndexedInvestigation, newSelectedCountyId: { id: number, value: County } | null) => Promise<void>;
    getNestedCellStyle: (cellKey: string , isLast : boolean) => string[];
    getRegularCellStyle: (rowIndex: number, cellKey: string , isGroupShown : boolean) => string[];
    sortInvestigationTable: (orderByValue: string) => void;
    onOk: () => void;
    onCancel: () => void;
    snackbarOpen: boolean;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
    totalCount: number;
    unassignedInvestigationsCount: number;
    fetchInvestigationsByGroupId: (groupId: string) => Promise<InvestigationTableRow[]>;
    changeGroupsInvestigator: (groupIds: string[], investigator: InvestigatorOption | null, transferReason?: string) => Promise<void>;
    changeInvestigationsInvestigator: (epidemiologyNumbers: number[], investigator: InvestigatorOption | null, transferReason?: string) => Promise<void>;
    changeGroupsDesk: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    changeInvestigationsDesk: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    statusFilter: StatusFilter;
    changeStatusFilter: (statuses: InvestigationMainStatus[]) => void;
    deskFilter: DeskFilter;
    changeDeskFilter: (desks: Desk[]) => void;
    searchQuery: string;
    changeSearchQuery: (searchQuery: string) => void;
    isSearchQueryValid: boolean;
};
