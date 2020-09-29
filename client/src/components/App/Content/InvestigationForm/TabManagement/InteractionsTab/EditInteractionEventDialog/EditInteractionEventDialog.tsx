import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
    
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './EditInteractionEventDialogStyles';
import useEditInteractionEventDialog from './useEditInteractionEventDialog';
import InteractionEventForm from '../InteractionEventForm/InteractionEventForm';

const newContactEventTitle = 'עריכת מקום/מגע';

const EditInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { closeDialog, eventToEdit, isOpen, updateInteraction } = props;
    
    const classes = useStyles();
    
    const [interactionEventDialogData, setInteractionEventDialogData] = useState<InteractionEventDialogData>(eventToEdit);

    const canConfirm = React.useMemo<boolean>(() => true, []);

    const { editInteractionEvent, shouldDisableSubmitButton } = useEditInteractionEventDialog({closeDialog, updateInteraction, canConfirm, interactionEventDialogData});

    const onConfirm = () => editInteractionEvent(interactionEventDialogData)

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
                <DialogContent>
                    <InteractionEventForm intractionData={eventToEdit}/>
                </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => closeDialog()}
                    color='default' 
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    form="interactionEventForm"
                    type="submit"
                    disabled={shouldDisableSubmitButton()}
                    id='createContact'
                    // onClick={() => onConfirm()}
                >
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