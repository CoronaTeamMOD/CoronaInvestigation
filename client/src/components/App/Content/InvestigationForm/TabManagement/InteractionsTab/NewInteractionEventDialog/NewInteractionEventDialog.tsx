import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import Validator from 'Utils/Validations/Validator';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './NewInteractionEventDialogStyles';
import useNewInteractionEventDialog from './useNewInteractionEventDialog';
import InteractionEventForm, { defaultContact } from '../InteractionEventForm/InteractionEventForm';
import {
    InteractionEventDialogProvider, initialDialogData, InteractionsEventDialogDataAndSet, InteractionEventDialogContext
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { eventDate, closeDialog, isOpen, handleInteractionCreation } = props;

    const defaultDate = new Date(startOfDay(eventDate).toUTCString());

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [interactionEventDialogData, setInteractionEventDialogData] =
    useState<InteractionEventDialogData>(
        initialDialogData(defaultDate, defaultDate, [defaultContact], epidemiologyNumber));

    const canConfirm = React.useMemo<boolean>(() => true, []);
    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);       
        
        const classes = useStyles();            

        const { createNewInteractionEvent, shouldDisableSubmitButton } = useNewInteractionEventDialog({ closeDialog, handleInteractionCreation, canConfirm, interactionEventDialogData});


    const onConfirm = () => createNewInteractionEvent(interactionEventDialogData);

    return (
        <Dialog classes={{ paper: classes.dialogPaper }} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
            <InteractionEventDialogProvider value={interactionEventDialogDataVariables}>
                <DialogContent>
                    <InteractionEventForm />
                </DialogContent>
            </InteractionEventDialogProvider>
            <DialogActions className={classes.dialogFooter}>
                <Button
                    test-id='cancelNewContactLocation'
                    onClick={() => closeDialog()}
                    color='default'
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton
                    disabled={shouldDisableSubmitButton()}
                    test-id='createContact'
                    onClick={() => onConfirm()}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;

export interface Props {
    isOpen: boolean,
    eventDate: Date,
    closeDialog: () => void,
    handleInteractionCreation: (addedInteraction: InteractionEventDialogData) => void,
}
