import React, { useState } from 'react';
import { SvgIconComponent, Close, Send, PersonPin } from '@material-ui/icons';
import { Card, IconButton, Typography, useMediaQuery } from '@material-ui/core';

import Desk from 'models/Desk';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';

import FooterAction from './FooterAction/FooterAction';
import useStyle from './InvestigationTableFooterStyles';
import TransferInvestigationDesk from './TransferInvestigationsDialogs/TransferInvestigationDesk';
import TransferInvestigationInvestigator from './TransferInvestigationsDialogs/TransferInvestigationInvestigator';

import useInvestigationTableFooter from './useInvestigationTableFooter';

export interface CardActionDescription {
    icon: SvgIconComponent;
    displayTitle: string;
    onClick: () => void;
};
    
const InvestigationTableFooter: React.FC<Props> = React.forwardRef((props: Props, ref) => {
        
    const { checkedRowsIds, allDesks, allInvestigators, onClose, tableRows, setTableRows } = props;

    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const [openDesksDialog, setOpenDesksDialog] = useState<boolean>(false);
    const [openInvestigatorsDialog, setOpenInvestigatorsDialog] = useState<boolean>(false);

    const {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenInvestigatorsDialog,
        handleCloseInvestigatorsDialog,
        handleConfirmDesksDialog,
        handleConfirmInvestigatorsDialog
    } = useInvestigationTableFooter({ setOpenDesksDialog, setOpenInvestigatorsDialog, checkedRowsIds, tableRows, setTableRows })

    const classes = useStyle(isScreenWide)();

    const isSingleInvestigation = checkedRowsIds.length === 1;
    
    const singleInvestigation = 'חקירה';
    const multipleInvestigations = 'חקירות';
    const singleAssignment = 'הקצאה';
    const multipleAssignments = 'הקצאות';


    const cardActions: CardActionDescription[] = [
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

    return (
        <>
            <Card className={classes.card} ref={ref}>
                <div className={classes.avatar}>
                    <Typography>{isSingleInvestigation ? singleInvestigation : checkedRowsIds.length}</Typography>
                    <Typography>{isSingleInvestigation ? 'אחת' : multipleInvestigations}</Typography>
                </div>
                {cardActions.map(cardAction => <FooterAction key={cardAction.displayTitle} icon={cardAction.icon} displayTitle={cardAction.displayTitle} onClick={cardAction.onClick} />)}
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </Card>
            <TransferInvestigationDesk allDesks={allDesks} open={openDesksDialog} 
                onClose={handleCloseDesksDialog} onConfirm={handleConfirmDesksDialog} />
            <TransferInvestigationInvestigator allInvestigators={allInvestigators} open={openInvestigatorsDialog} 
                onClose={handleCloseInvestigatorsDialog} onConfirm={handleConfirmInvestigatorsDialog} />
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