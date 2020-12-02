import React, { useState, useMemo } from 'react';
import { Card, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import { SvgIconComponent, Close, Send, PersonPin, CollectionsBookmark } from '@material-ui/icons';

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
    onClick: () => void;
};
    
const InvestigationTableFooter: React.FC<Props> = React.forwardRef((props: Props, ref) => {
        
    const { checkedRowsIds, allDesks, allInvestigators, onClose, tableRows, setTableRows, fetchTableData } = props;

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
        handleConfirmInvestigatorsDialog
    } = useInvestigationTableFooter({ setOpenDesksDialog, setOpenInvestigatorsDialog, setOpenGroupedInvestigations,
                                      checkedRowsIds, tableRows, setTableRows })

    const classes = useStyle(isScreenWide)();

    const isSingleInvestigation = checkedRowsIds.length === 1;
    
    const singleInvestigation = 'חקירה';
    const multipleInvestigations = 'חקירות';
    const singleAssignment = 'הקצאה';
    const multipleAssignments = 'הקצאות';

    const cardActions: CardActionDescription[] = [
        {
            icon: CollectionsBookmark,
            displayTitle: 'קיבוץ חקירות',
            onClick: handleOpenGroupedInvestigations
        },
        {
            icon: Send,
            displayTitle: `העברת ${isSingleInvestigation ? singleInvestigation : multipleInvestigations}`,
            onClick: handleOpenDesksDialog
        },
        {
            icon: PersonPin,
            displayTitle: `${isSingleInvestigation ? singleAssignment : multipleAssignments} לחוקר`,
            onClick: handleOpenInvestigatorsDialog
        }
    ]

    const investigationsToGroup: InvestigationTableRow[] = useMemo(() => {
        return tableRows.filter((tableRow: InvestigationTableRow) => checkedRowsIds.includes(tableRow.epidemiologyNumber));
    }, [tableRows, checkedRowsIds])

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
                invetigationsToGroup={investigationsToGroup}
                fetchTableData={fetchTableData}
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
    fetchTableData: () => void;
}