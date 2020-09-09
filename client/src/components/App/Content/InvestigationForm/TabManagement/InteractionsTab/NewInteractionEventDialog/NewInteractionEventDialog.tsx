import React, {useState} from 'react';
import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './NewInteractionEventDialogStyles';
import useNewInteractionEventDialog from './useNewInteractionEventDialog';
import {
    InteractionEventDialogProvider, initialDialogData, InteractionsEventDialogDataAndSet
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import { InteractionEventForm, defaultContact } from '../InteractionEventForm/InteractionEventForm';

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { eventDate, closeDialog, isOpen } = props;
    const { createNewInteractionEvent } = useNewInteractionEventDialog({closeDialog});

    const defaultDate = new Date(startOfDay(eventDate).toUTCString());

    const classes = useStyles();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [interactionEventDialogData, setInteractionEventDialogData] = 
        useState<InteractionEventDialogData>(
            initialDialogData('', defaultDate, defaultDate, [defaultContact], epidemiologyNumber));
        
    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);

    const onConfirm = () => createNewInteractionEvent(interactionEventDialogData);

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
            <InteractionEventDialogProvider value={interactionEventDialogDataVariables}>
                <DialogContent>
                    <InteractionEventForm/>
                </DialogContent>
            </InteractionEventDialogProvider>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => closeDialog()}
                    color='default' 
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    id='createContact'
                    onClick={() => onConfirm()}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;

export interface Props {
    closeDialog: () => void,
    isOpen: boolean,
    eventDate: Date,
}