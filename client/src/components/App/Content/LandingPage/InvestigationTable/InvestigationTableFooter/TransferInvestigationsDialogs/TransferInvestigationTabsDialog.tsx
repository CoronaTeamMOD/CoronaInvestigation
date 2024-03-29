import React from 'react';
import { SweetAlertResult } from 'sweetalert2';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import Desk from 'models/Desk';
import County from 'models/County';

import useStyles from './TransferDialogsStyles';
import TransferInvestigationTabs from './TransferInvestigationTabs';
import KeyValuePair from 'models/KeyValuePair';

const TITLE = 'העברת חקירות';

const TransferInvestigationDialog = (props: Props) => {

    const { allDesks, open, onClose, onDeskTransfer, onCountyTransfer, onSuccess, isGroupedContact } = props;

    const classes = useStyles();

    return (
        <Dialog classes={{ paper: classes.dialog }} open={open} onClose={onClose}>
            <DialogTitle>
                <b>
                    {TITLE}
                </b>
            </DialogTitle>
            <DialogContent>
                <TransferInvestigationTabs
                    open={open}
                    allDesks={allDesks}
                    onDeskTransfer={onDeskTransfer}
                    onCountyTransfer={onCountyTransfer}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    isGroupedContact={isGroupedContact}
                />
            </DialogContent>
        </Dialog>
    )
};

interface Props {
    open: boolean;
    onClose: () => void;
    onDeskTransfer: (updatedDesk: Desk, transferReason: KeyValuePair, otherTransferReason:string) => void;
    onCountyTransfer: (updatedCounty: County, transferReason: KeyValuePair, otherTransferReason:string) => void;
    allDesks: Desk[];
    onSuccess: () => Promise<SweetAlertResult<any>>;
    isGroupedContact: boolean;
};

export default TransferInvestigationDialog;