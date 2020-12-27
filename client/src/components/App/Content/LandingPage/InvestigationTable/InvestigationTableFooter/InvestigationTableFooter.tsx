import React, { useState, useMemo } from 'react';
import { Card, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import { SvgIconComponent, Close, Send, PersonPin, CollectionsBookmark, CallSplit } from '@material-ui/icons';

import Desk from 'models/Desk';
import County from 'models/County';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';

import FooterAction from './FooterAction/FooterAction';
import useStyle from './InvestigationTableFooterStyles';
import { IndexedInvestigation } from '../InvestigationTablesHeaders';
import useInvestigationTableFooter from './useInvestigationTableFooter';
import GroupedInvestigations from './GroupedInvestigations/GroupedInvestigations'
import InvestigatorAllocationDialog from '../InvestigatorAllocation/InvestigatorAllocationDialog';
import { toUniqueGroupsWithNonGroupedInvestigations } from './GroupedInvestigations/useGroupedInvestigations';
import TransferInvestigationTabsDialog from './TransferInvestigationsDialogs/TransferInvestigationTabsDialog';

export interface CardActionDescription {
    icon: SvgIconComponent;
    displayTitle: string;
    disabled?: boolean;
    errorMessage: string;
    onClick: () => void;
};

interface DisbandAction {
    disabled: boolean;
    groupIds: string[];
}

const singleInvestigation = 'חקירה';
const multipleInvestigations = 'חקירות';
const singleAssignment = 'הקצאה';
const multipleAssignments = 'הקצאות';

const InvestigationTableFooter: React.FC<Props> = React.forwardRef((props: Props, ref) => {

    const { checkedIndexedRows, allDesks, allCounties, allInvestigators, isInvestigatorAllocationDialogOpen,
            onDialogClose, tableRows, allGroupedInvestigations, onDeskChange,
            onDeskGroupChange, onCountyChange, onCountyGroupChange, 
            fetchTableData, fetchInvestigationsByGroupId, setIsInvestigatorAllocationDialogOpen, allocateInvestigationToInvestigator } = props;

    const { alertSuccess } = useCustomSwal();
    const onTransferSuccess = () => alertSuccess('החקירות הועברו בהצלחה');
    const onAllocationSuccess = () => alertSuccess('החוקר הוקצה בהצלחה');

    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const [openDesksDialog, setOpenDesksDialog] = useState<boolean>(false);
    const [openGroupedInvestigations, setOpenGroupedInvestigations] = useState<boolean>(false);

    const {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenGroupedInvestigations,
        handleCloseGroupedInvestigations,
        handleOpenInvesigatorAllocationDialog,
        handleCloseInvesigatorAllocationDialog,
        handleConfirmDesksDialog,
        handleConfirmCountiesDialog,
        handleDisbandGroupedInvestigations
    } = useInvestigationTableFooter({
        setOpenDesksDialog,
        setOpenGroupedInvestigations,
        setIsInvestigatorAllocationDialogOpen,
        checkedIndexedRows,
        fetchTableData,
        onDialogClose,
        onDeskChange,
        onDeskGroupChange,
        onCountyChange,
        onCountyGroupChange,
    });

    const classes = useStyle(isScreenWide)();

    const isSingleInvestigation = checkedIndexedRows.length === 1;

    const checkedInvestigations: InvestigationTableRow[] = useMemo(() => {
        return tableRows.filter((tableRow: InvestigationTableRow) => checkedIndexedRows.map(indexedRow => indexedRow.epidemiologyNumber).includes(tableRow.epidemiologyNumber));
    }, [tableRows, checkedIndexedRows])

    const disbandAction: DisbandAction = useMemo(() => {
        if (checkedInvestigations.find((investigation: InvestigationTableRow) => investigation.groupId === null)) {
            return {
                disabled: true,
                groupIds: []
            }
        } else {
            return {
                disabled: false,
                groupIds: Array.from(new Set(checkedInvestigations.map((investigationToDisband: InvestigationTableRow) => investigationToDisband.groupId)))
            }
        }
    }, [checkedInvestigations])

    const trimmedGroup = useMemo(() => {
        return checkedInvestigations.reduce<{
                uniqueGroupIds: string[],
                epidemiologyNumbers: number[]
            }>(toUniqueGroupsWithNonGroupedInvestigations, {
                uniqueGroupIds: [],
                epidemiologyNumbers: []
            })
    }, [checkedInvestigations])

    const shouldGroupActionDisabled: boolean = useMemo(() => {
        return trimmedGroup.uniqueGroupIds.length > 1 || trimmedGroup.epidemiologyNumbers.length === 0 || checkedInvestigations.length < 2
    }, [trimmedGroup, checkedInvestigations])

    const cardActions: CardActionDescription[] = [
        {
            icon: CollectionsBookmark,
            displayTitle: 'קיבוץ חקירות',
            disabled: shouldGroupActionDisabled,
            errorMessage: shouldGroupActionDisabled ? 'שים לב לא ניתן לקבץ חקירה שכבר מקובצת' : '',
            onClick: handleOpenGroupedInvestigations
        },
        {
            icon: CallSplit,
            displayTitle: 'ביטול קיבוץ',
            disabled: disbandAction.disabled,
            errorMessage: disbandAction.disabled ? 'שים לב, לא ניתן לבטל חקירה שאינה מקובצת' : '',
            onClick: () => handleDisbandGroupedInvestigations(disbandAction.groupIds)
        },
        {
            icon: Send,
            displayTitle: `העברת ${isSingleInvestigation ? singleInvestigation : multipleInvestigations}`,
            errorMessage: '',
            onClick: handleOpenDesksDialog
        },
        {
            icon: PersonPin,
            displayTitle: `${isSingleInvestigation ? singleAssignment : multipleAssignments} לחוקר`,
            errorMessage: '',
            onClick: handleOpenInvesigatorAllocationDialog
        }
    ]

    return (
        <>
            <Card className={classes.card} ref={ref}>
                <div className={classes.avatar}>
                    <Typography>{isSingleInvestigation ? singleInvestigation : checkedIndexedRows.length}</Typography>
                    <Typography>{isSingleInvestigation ? 'אחת' : multipleInvestigations}</Typography>
                </div>
                {cardActions.map(cardAction => <FooterAction
                    key={cardAction.displayTitle}
                    icon={cardAction.icon}
                    displayTitle={cardAction.displayTitle}
                    onClick={cardAction.onClick}
                    disabled={cardAction.disabled}
                    errorMessage={cardAction.errorMessage}
                />)}
                <IconButton onClick={onDialogClose}>
                    <Close />
                </IconButton>
            </Card>
            <TransferInvestigationTabsDialog
                open={openDesksDialog}
                onDeskTransfer={handleConfirmDesksDialog}
                onCountyTransfer={handleConfirmCountiesDialog}
                onClose={handleCloseDesksDialog}
                allDesks={allDesks}
                allCounties={allCounties}
                onSuccess={onTransferSuccess}
            />
            <InvestigatorAllocationDialog
                isOpen={isInvestigatorAllocationDialogOpen}
                handleCloseDialog={handleCloseInvesigatorAllocationDialog}
                investigators={allInvestigators}
                allocateInvestigationToInvestigator={allocateInvestigationToInvestigator}
                groupIds={trimmedGroup.uniqueGroupIds}
                epidemiologyNumbers={trimmedGroup.epidemiologyNumbers}
                onSuccess={onAllocationSuccess}
            />
            <GroupedInvestigations
                open={openGroupedInvestigations}
                onClose={handleCloseGroupedInvestigations}
                invetigationsToGroup={checkedInvestigations}
                allGroupedInvestigations={allGroupedInvestigations}
                fetchTableData={fetchTableData}
                fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
            />
        </>
    );
})

export default InvestigationTableFooter;

interface Props {
    onDialogClose: () => void;
    checkedIndexedRows: IndexedInvestigation[];
    allDesks: Desk[];
    allCounties: County[];
    allInvestigators: Promise<InvestigatorOption[]>;
    tableRows: InvestigationTableRow[];
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    isInvestigatorAllocationDialogOpen: boolean;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onCountyGroupChange: (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => void;
    onCountyChange: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => void;
    setIsInvestigatorAllocationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    allocateInvestigationToInvestigator: (groupIds: string[], epidemiologyNumbers: number[], investigatorToAllocate: InvestigatorOption) => void;
}