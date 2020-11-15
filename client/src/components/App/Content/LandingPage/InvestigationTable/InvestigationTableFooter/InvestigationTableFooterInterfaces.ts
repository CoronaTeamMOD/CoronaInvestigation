import Desk from 'models/Desk';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';

export interface InvestigationTableFooterParameters {
    checkedRowsIds: number[];
    tableRows: InvestigationTableRow[];
    setTableRows: React.Dispatch<React.SetStateAction<InvestigationTableRow[]>>;
    setOpenDesksDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenInvestigatorsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface InvestigationTableFooterOutcome {
    handleOpenDesksDialog: () => void;
    handleCloseDesksDialog: () => void;
    handleOpenInvestigatorsDialog: () => void;
    handleCloseInvestigatorsDialog: () => void;
    handleConfirmDesksDialog: (updatedDesk: Desk, transferReason: string) => void;
    handleConfirmInvestigatorsDialog: (updatedIvestigator: InvestigatorOption | undefined, transferReason: string) => void;
};
