import Desk from 'models/Desk';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { IndexedInvestigation } from '../InvestigationTablesHeaders';

export interface InvestigationTableFooterParameters {
    checkedIndexedRows: IndexedInvestigation[];
    tableRows: InvestigationTableRow[];
    setTableRows: React.Dispatch<React.SetStateAction<InvestigationTableRow[]>>;
    setOpenDesksDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenInvestigatorsDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupedInvestigations: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTableData: () => void;
    onDialogClose: () => void;
    onDeskChange: (indexedRow: IndexedInvestigation, newSelectedDesk: Desk | null) => Promise<void>;
    onInvestigatorChange: (epidemiologyNumbers: number[], investigator: InvestigatorOption | null, transferReason?: string) => Promise<void>;
    onInvestigatorGroupChange: (groupIds: string[], investigator: InvestigatorOption | null) => Promise<void>;
}

export interface InvestigationTableFooterOutcome {
    handleOpenDesksDialog: () => void;
    handleCloseDesksDialog: () => void;
    handleOpenInvestigatorsDialog: () => void;
    handleCloseInvestigatorsDialog: () => void;
    handleOpenGroupedInvestigations: () => void;
    handleCloseGroupedInvestigations: () => void;
    handleConfirmDesksDialog: (updatedDesk: Desk, transferReason: string) => void;
    handleConfirmInvestigatorsDialog: (updatedIvestigator: InvestigatorOption, transferReason: string) => void;
    handleDisbandGroupedInvestigations: (groupIds: string[]) => void;
};
