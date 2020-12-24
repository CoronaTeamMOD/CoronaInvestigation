import React, { useState, useMemo } from 'react';
import { Card, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import { SvgIconComponent, Close, Send, PersonPin, CollectionsBookmark, CallSplit } from '@material-ui/icons';

import Desk from 'models/Desk';
import County from 'models/County';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';

import FooterAction from './FooterAction/FooterAction';
import useStyle from './InvestigationTableFooterStyles';
import { IndexedInvestigation } from '../InvestigationTablesHeaders';
import useInvestigationTableFooter from './useInvestigationTableFooter';
import GroupedInvestigations from './GroupedInvestigations/GroupedInvestigations'
import { toUniqueGroupsWithNonGroupedInvestigations } from './GroupedInvestigations/useGroupedInvestigations';
import TransferInvestigationTabsDialog from './TransferInvestigationsDialogs/TransferInvestigationTabsDialog';
import TransferInvestigationInvestigator from './TransferInvestigationsDialogs/TransferInvestigationInvestigator';

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

    const { checkedIndexedRows, allDesks, allCounties, allInvestigators, onDialogClose, tableRows, allGroupedInvestigations, onDeskChange,
        onDeskGroupChange, onCountyChange, onCountyGroupChange,
        onInvestigatorGroupChange, onInvestigatorChange, fetchTableData, fetchInvestigationsByGroupId } = props;

    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const [openDesksDialog, setOpenDesksDialog] = useState<boolean>(false);
    const [openInvestigatorsDialog, setOpenInvestigatorsDialog] = useState<boolean>(false);
    const [openGroupedInvestigations, setOpenGroupedInvestigations] = useState<boolean>(false);

    const {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenInvestigatorsDialog,
        handleCloseInvestigatorsDialog,
        handleOpenGroupedInvestigations,
        handleCloseGroupedInvestigations,
        handleConfirmDesksDialog,
        handleConfirmCountiesDialog,
        handleConfirmInvestigatorsDialog,
        handleDisbandGroupedInvestigations
    } = useInvestigationTableFooter({
        setOpenDesksDialog,
        setOpenInvestigatorsDialog,
        setOpenGroupedInvestigations,
        checkedIndexedRows,
        fetchTableData,
        onDialogClose,
        onDeskChange,
        onDeskGroupChange,
        onCountyChange,
        onCountyGroupChange,
        onInvestigatorChange,
        onInvestigatorGroupChange
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

    const shouldGroupActionDisabled: boolean = useMemo(() => {
        const trimmedGroup = checkedInvestigations.reduce<{
            uniqueGroupIds: string[],
            epidemiologyNumbers: number[]
        }>(toUniqueGroupsWithNonGroupedInvestigations, {
            uniqueGroupIds: [],
            epidemiologyNumbers: []
        })
        return trimmedGroup.uniqueGroupIds.length > 1 || trimmedGroup.epidemiologyNumbers.length === 0 || checkedInvestigations.length < 2
    }, [checkedInvestigations])

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
            onClick: handleOpenInvestigatorsDialog
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
            />
            <TransferInvestigationInvestigator
                open={openInvestigatorsDialog}
                onConfirm={handleConfirmInvestigatorsDialog}
                onClose={handleCloseInvestigatorsDialog}
                allInvestigators={allInvestigators}
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
    allInvestigators: InvestigatorOption[];
    tableRows: InvestigationTableRow[];
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
    onDeskGroupChange: (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onDeskChange: (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => Promise<void>;
    onCountyGroupChange: (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => void;
    onCountyChange: (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => void;
    onInvestigatorGroupChange: (groupIds: string[], investigator: InvestigatorOption | null, transferReason?: string) => Promise<void>;
    onInvestigatorChange: (epidemiologyNumbers: number[], investigator: InvestigatorOption | null, transferReason?: string) => Promise<void>;
}