import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';

import useStyles from './TransferDialogsStyles';

const TransferInvestigationDialog = (props: Props) => {

    const { children, open, onClose, onConfirm } = props;

    const classes = useStyles();

    return (
        <Dialog classes={{paper: classes.dialog}} open={open} onClose={onClose}>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button className={classes.button} variant='contained' onClick={onClose} color='default'>
                    ביטול
                </Button>
                <Button className={classes.button} variant='contained' onClick={onConfirm} color='primary'>
                    אישור
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    children: JSX.Element;
    onClose: () => void;
    onConfirm: () => void;
}

export default TransferInvestigationDialog;