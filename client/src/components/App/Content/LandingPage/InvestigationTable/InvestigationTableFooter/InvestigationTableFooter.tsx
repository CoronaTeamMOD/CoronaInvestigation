import React, { useState, useMemo } from 'react';
import { Card, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import { SvgIconComponent, Close, Send, PersonPin, CollectionsBookmark, CallSplit, Edit } from '@material-ui/icons';

import Desk from 'models/Desk';
import County from 'models/County';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

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
const changeStatusToNotInvestigated = 'שינוי סטטוס ללא נחקר';

const InvestigationTableFooter: React.FC<Props> = React.forwardRef((props: Props, ref) => {

    const { checkedIndexedRows, allDesks, fetchInvestigators,
        onDialogClose, tableRows, allGroupedInvestigations, onDeskChange,
        onDeskGroupChange, onCountyChange, onCountyGroupChange, fetchTableData,
        fetchInvestigationsByGroupId, allocateInvestigationToInvestigator, selectAllAction } = props;

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
        isInvestigatorAllocationFooterDialogOpen,
        handleOpenInvesigatorAllocationFooterDialog,
        handleCloseInvesigatorAllocationFooterDialog,
        handleConfirmDesksDialog,
        handleConfirmCountiesDialog,
        handleDisbandGroupedInvestigations,
        updateNotInvestigatedStatus,
        updateNotInvestigatedSubStatus
    } = useInvestigationTableFooter({
        setOpenDesksDialog,
        setOpenGroupedInvestigations,
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

    const updateNotInvestigatedStatuses = () => {
        checkedInvestigations.forEach(investigation => {
            updateNotInvestigatedStatus(investigation.epidemiologyNumber, investigation.mainStatus.id, checkedInvestigations.length)
            investigation.mainStatus.id === InvestigationMainStatusCodes.NEW && updateNotInvestigatedSubStatus(investigation.epidemiologyNumber)
        });
    }

    const cardActions: CardActionDescription[] = [
        {
            icon: CollectionsBookmark,
            displayTitle: 'קיבוץ חקירות',
            disabled: shouldGroupActionDisabled || selectAllAction,
            errorMessage: shouldGroupActionDisabled ?
                checkedInvestigations.length > 1 ? 'שים לב לא ניתן לקבץ חקירה שכבר מקובצת' : 'חקירה לא מקובצת'
                : '',
            onClick: handleOpenGroupedInvestigations
        },
        {
            icon: CallSplit,
            displayTitle: 'ביטול קיבוץ',
            disabled: disbandAction.disabled || selectAllAction,
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
            onClick: handleOpenInvesigatorAllocationFooterDialog,
            disabled: selectAllAction
        },
        {
            icon: Edit,
            displayTitle: changeStatusToNotInvestigated,
            errorMessage: '',
            onClick: updateNotInvestigatedStatuses
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
                onSuccess={onTransferSuccess}
                isGroupedContact={!isSingleInvestigation}
            />
            <InvestigatorAllocationDialog
                isOpen={isInvestigatorAllocationFooterDialogOpen}
                handleCloseDialog={handleCloseInvesigatorAllocationFooterDialog}
                fetchInvestigators={fetchInvestigators}
                allocateInvestigationToInvestigator={allocateInvestigationToInvestigator}
                groupIds={trimmedGroup.uniqueGroupIds}
                epidemiologyNumbers={trimmedGroup.epidemiologyNumbers}
                onSuccess={onAllocationSuccess}
                isGroupedContact={!isSingleInvestigation}
            />
            <GroupedInvestigations
                open={openGroupedInvestigations}
                onClose={handleCloseGroupedInvestigations}
                investigationsToGroup={checkedInvestigations}
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
    fetchInvestigators: () => Promise<InvestigatorOption[]>;
    tableRows: InvestigationTableRow[];
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onCountyGroupChange: (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => Promise<void>;
    onCountyChange: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => void;
    allocateInvestigationToInvestigator: (groupIds: string[], epidemiologyNumbers: number[], investigatorToAllocate: InvestigatorOption) => void;
    selectAllAction: boolean;
}