import React from 'react';
import { SweetAlertResult } from 'sweetalert2';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import Desk from 'models/Desk';
import County from 'models/County';

import useStyles from './TransferDialogsStyles';
import TransferInvestigationTabs from './TransferInvestigationTabs';

const TITLE = 'העברת חקירות';

const TransferInvestigationDialog = (props: Props) => {

    const { allDesks, allCounties, open, onClose, onDeskTransfer, onCountyTransfer, onSuccess } = props;

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
                    allCounties={allCounties}
                    onDeskTransfer={onDeskTransfer}
                    onCountyTransfer={onCountyTransfer}
                    onClose={onClose}
                    onSuccess={onSuccess}
                />
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    onClose: () => void;
    onDeskTransfer: (updatedDesk: Desk, transferReason: string) => void;
    onCountyTransfer: (updatedCounty: County, transferReason: string) => void;
    allDesks: Desk[];
    allCounties: County[];
    onSuccess: () => Promise<SweetAlertResult<any>>

}

export default TransferInvestigationDialog;