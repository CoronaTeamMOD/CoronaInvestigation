import React, { useState, useMemo } from 'react';
import { Card, IconButton, Typography, useMediaQuery, Tooltip } from '@material-ui/core';
import { SvgIconComponent, Close, Send, PersonPin, CollectionsBookmark, CallSplit } from '@material-ui/icons';

import Desk from 'models/Desk';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';

import FooterAction from './FooterAction/FooterAction';
import useStyle from './InvestigationTableFooterStyles';
import useInvestigationTableFooter from './useInvestigationTableFooter';
import GroupedInvestigations from './GroupedInvestigations/GroupedInvestigations'
import TransferInvestigationDesk from './TransferInvestigationsDialogs/TransferInvestigationDesk';
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
        
    const { checkedRowsIds, allDesks, allInvestigators, onClose, tableRows, setTableRows } = props;

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
        handleConfirmInvestigatorsDialog,
        handleDisbandGroupedInvestigations
    } = useInvestigationTableFooter({ setOpenDesksDialog, setOpenInvestigatorsDialog, setOpenGroupedInvestigations,
                                      checkedRowsIds, tableRows, setTableRows })

    const classes = useStyle(isScreenWide)();

    const isSingleInvestigation = checkedRowsIds.length === 1;
    
    const checkedInvestigations: InvestigationTableRow[] = useMemo(() => {
        return tableRows.filter((tableRow: InvestigationTableRow) => checkedRowsIds.includes(tableRow.epidemiologyNumber));
    }, [tableRows, checkedRowsIds])

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
        return Boolean(checkedInvestigations.find((investigationToGroup: InvestigationTableRow) => investigationToGroup.groupId !== null))
    }, [checkedInvestigations])

    const cardActions: CardActionDescription[] = [
        {
            icon: CollectionsBookmark,
            displayTitle: 'קיבוץ חקירות',
            disabled: shouldGroupActionDisabled,
            errorMessage: shouldGroupActionDisabled ? 'שים לב לא ניתן לקבץ חקירה שכבר מקובצת': '',
            onClick: handleOpenGroupedInvestigations
        },
        {
            icon: CallSplit,
            displayTitle: 'ביטול קיבוץ',
            disabled: disbandAction.disabled,
            errorMessage: disbandAction.disabled ? 'שים לב, לא ניתן לבטל חקירה שאינה מקובצת': '',
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
                    <Typography>{isSingleInvestigation ? singleInvestigation : checkedRowsIds.length}</Typography>
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
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </Card>
            <TransferInvestigationDesk 
                open={openDesksDialog} 
                onConfirm={handleConfirmDesksDialog} 
                onClose={handleCloseDesksDialog}
                allDesks={allDesks} 
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
            />
        </>
    );
})

export default InvestigationTableFooter;

interface Props {
    onClose: () => void;
    checkedRowsIds: number[];
    allDesks: Desk[];
    allInvestigators: InvestigatorOption[];
    tableRows: InvestigationTableRow[];
    setTableRows: React.Dispatch<React.SetStateAction<InvestigationTableRow[]>>;
}