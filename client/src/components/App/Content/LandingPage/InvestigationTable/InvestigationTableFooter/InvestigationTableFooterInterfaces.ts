import Desk from 'models/Desk';
import {FetchedInvestigatorOption} from 'models/InvestigatorOption';
import { IndexedInvestigation } from '../InvestigationTablesHeaders';

export interface InvestigationTableFooterParameters {
    checkedIndexedRows: IndexedInvestigation[];
    setOpenDesksDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenInvestigatorsDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupedInvestigations: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTableData: () => void;
    onDialogClose: () => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onInvestigatorChange: (epidemiologyNumbers: number[], investigator: FetchedInvestigatorOption | null, transferReason?: string) => Promise<void>;
    onInvestigatorGroupChange: (groupIds: string[], investigator: FetchedInvestigatorOption | null, transferReason?: string) => Promise<void>;
}

export interface InvestigationTableFooterOutcome {
    handleOpenDesksDialog: () => void;
    handleCloseDesksDialog: () => void;
    handleOpenInvestigatorsDialog: () => void;
    handleCloseInvestigatorsDialog: () => void;
    handleOpenGroupedInvestigations: () => void;
    handleCloseGroupedInvestigations: () => void;
    handleConfirmDesksDialog: (updatedDesk: Desk, transferReason: string) => void;
    handleConfirmInvestigatorsDialog: (updatedIvestigator: FetchedInvestigatorOption, transferReason: string) => void;
    handleDisbandGroupedInvestigations: (groupIds: string[]) => void;
};
