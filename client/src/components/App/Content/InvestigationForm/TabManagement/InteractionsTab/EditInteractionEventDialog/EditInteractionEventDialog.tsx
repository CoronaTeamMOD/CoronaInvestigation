import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
    
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './EditInteractionEventDialogStyles';
import useEditInteractionEventDialog from './useEditInteractionEventDialog';
import {
    InteractionEventDialogProvider, InteractionsEventDialogDataAndSet
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventForm from '../InteractionEventForm/InteractionEventForm';

const newContactEventTitle = 'עריכת מקום/מגע';

const EditInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { closeDialog, eventToEdit, isOpen, updateInteraction } = props;
    const { editInteractionEvent } = useEditInteractionEventDialog({closeDialog, updateInteraction});
    
    const classes = useStyles();
    
    const [interactionEventDialogData, setInteractionEventDialogData] = useState<InteractionEventDialogData>(eventToEdit);

    const canConfirm = React.useMemo<boolean>(() => true, [])

    const { placeType, placeSubType } = interactionEventDialogData;
    
    React.useEffect(() => {
        if (placeType === eventToEdit.placeType && placeSubType === eventToEdit.placeSubType) {
            setInteractionEventDialogData(eventToEdit)
        } 
    }, [placeType, placeSubType])

    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);

    const onConfirm = () => editInteractionEvent(interactionEventDialogData)

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
                    disabled={!canConfirm}
                    id='createContact'
                    onClick={() => onConfirm()}>
                    שמור שינויים
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditInteractionEventDialog;

export interface Props {
    isOpen: boolean,
    eventToEdit: InteractionEventDialogData
    closeDialog: () => void,
    updateInteraction: (updatedInteraction: InteractionEventDialogData) => void,
}