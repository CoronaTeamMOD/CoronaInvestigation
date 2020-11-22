import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import useStyles from './TransferDialogsStyles';

const TransferInvestigationDialog = (props: Props) => {

    const { children, open, isConfirmDisabled, title, formName, onClose, onConfirm } = props;

    const classes = useStyles();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onConfirm();
    }

    return (
        <form id={formName} onSubmit={onSubmit}>
            <Dialog classes={{paper: classes.dialog}} open={open} onClose={onClose}>
                <DialogTitle>
                    <b>
                        {title}
                    </b>
                </DialogTitle>
                <DialogContent>
                        {children}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button className={classes.button} variant='contained' onClick={onClose} color='default'>
                        ביטול
                    </Button>
                    <Button type='submit' 
                            form={formName} 
                            disabled={isConfirmDisabled} 
                            className={classes.button} 
                            variant='contained' 
                            color='primary'
                            >
                        אישור
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}

interface Props {
    open: boolean;
    children: JSX.Element;
    isConfirmDisabled: boolean;
    title: string;
    formName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default TransferInvestigationDialog;