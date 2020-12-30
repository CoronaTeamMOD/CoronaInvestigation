import { MutableRefObject } from 'react';

import User from 'models/User';
import Desk from 'models/Desk';
import County from 'models/County';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { IndexedInvestigationData } from './InvestigationTablesHeaders';
import { SelectedRow } from './useInvestigationTable';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

export type StatusFilter = InvestigationMainStatusCodes[];
export type DeskFilter = InvestigationMainStatusCodes[];

export interface HistoryState {
    filterRules?: any;
    statusFilter?: StatusFilter;
    deskFilter?: DeskFilter;
    unassignedUserFilter?: boolean;
    inactiveUserFilter?: boolean;
    isAdminLandingRedirect: boolean;
}

export interface useInvestigationTableParameters {
    currentPage: number;
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    setSelectedRow: React.Dispatch<React.SetStateAction<SelectedRow>>;
    setAllUsersOfCurrCounty: React.Dispatch<React.SetStateAction<Map<string, User>>>;
    setAllCounties: React.Dispatch<React.SetStateAction<County[]>>;
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
    getNestedCellStyle: (isLast: boolean) => (cellKey: string) => string[];
    getRegularCellStyle: (rowIndex: number, isGroupShown: boolean) => (cellKey: string) => string[];
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
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    unassignedUserFilter: boolean;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    inactiveUserFilter: boolean;
    changeGroupsCounty: (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => void;
    changeInvestigationCounty: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => void;
    fetchAllCountyUsers: () => Promise<Map<string, User>>;
    tableTitle: string;
};