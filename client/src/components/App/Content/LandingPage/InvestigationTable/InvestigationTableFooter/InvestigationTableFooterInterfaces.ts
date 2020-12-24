import County from 'models/County';
import Desk from 'models/Desk';
import { IndexedInvestigation } from '../InvestigationTablesHeaders';

export interface InvestigationTableFooterParameters {
    checkedIndexedRows: IndexedInvestigation[];
    setOpenDesksDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupedInvestigations: React.Dispatch<React.SetStateAction<boolean>>;
    setIsInvestigatorAllocationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTableData: () => void;
    onDialogClose: () => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onCountyGroupChange: (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => void;
    onCountyChange: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => void;
}

export interface InvestigationTableFooterOutcome {
    handleOpenDesksDialog: () => void;
    handleCloseDesksDialog: () => void;
    handleOpenGroupedInvestigations: () => void;
    handleCloseGroupedInvestigations: () => void;
    handleOpenInvesigatorAloocationDialog: () => void;
    handleCloseInvesigatorAloocationDialog: () => void;
    handleConfirmDesksDialog: (updatedDesk: Desk, transferReason: string) => void;
    handleConfirmCountiesDialog: (updatedCounty: County, transferReason: string) => void;
    handleDisbandGroupedInvestigations: (groupIds: string[]) => void;
};
