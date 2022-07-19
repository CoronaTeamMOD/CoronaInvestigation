import Desk from 'models/Desk';
import County from 'models/County';

import { IndexedInvestigation } from '../InvestigationTablesHeaders';
import KeyValuePair from 'models/KeyValuePair';

export interface InvestigationTableFooterParameters {
    checkedIndexedRows: IndexedInvestigation[];
    setOpenDesksDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupedInvestigations: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTableData: () => void;
    onDialogClose: () => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?:KeyValuePair, otherTransferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?:KeyValuePair, otherTransferReason?: string) => Promise<void>;
    onCountyGroupChange: (groupIds: string[], newSelectedCounty: County | null, transferReason:KeyValuePair, otherTransferReason?: string) => void;
    onCountyChange: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason:KeyValuePair, otherTransferReason?: string) => void;
}

export interface InvestigationTableFooterOutcome {
    handleOpenDesksDialog: () => void;
    handleCloseDesksDialog: () => void;
    handleOpenGroupedInvestigations: () => void;
    handleCloseGroupedInvestigations: () => void;
    isInvestigatorAllocationFooterDialogOpen: boolean;
    handleOpenInvesigatorAllocationFooterDialog: () => void;
    handleCloseInvesigatorAllocationFooterDialog: () => void;
    handleConfirmDesksDialog: (updatedDesk: Desk, transferReason: KeyValuePair, othertransferReason:string) => void;
    handleConfirmCountiesDialog: (updatedCounty: County, transferReason: KeyValuePair, othertransferReason:string) => void;
    handleDisbandGroupedInvestigations: (groupIds: string[]) => void;
    updateNotInvestigatedStatus: (epidemiologyNumber: number, investigationStatusId: number,totalCount:number, subStatus: string | null) => void; 
    updateNotInvestigatedSubStatus: (epidemiologyNumber: number, age: number, complexityReasonsId: (number | null)[], vaccineDoseId: number | null) => string | null;
    setSettingsForStatusValidityRuleConfig: () => void
};
