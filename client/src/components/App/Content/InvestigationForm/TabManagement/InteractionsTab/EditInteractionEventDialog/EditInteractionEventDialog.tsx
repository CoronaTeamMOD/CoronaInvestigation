import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
    
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './EditInteractionEventDialogStyles';
import InteractionEventForm from '../InteractionEventForm/InteractionEventForm';

const newContactEventTitle = 'עריכת מקום/מגע';

const EditInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { closeEditDialog, eventToEdit, isOpen, loadInteractions, interactions  } = props;
    
    const classes = useStyles();
    
    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
                <DialogContent>
                    <InteractionEventForm 
                        interactions={interactions}
                        interactionData={eventToEdit}
                        loadInteractions={loadInteractions}
                        closeEditDialog={closeEditDialog}
                        closeNewDialog={()=>{}}
                    />
                </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => closeEditDialog()}
                    color='default' 
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton
                    form='interactionEventForm'
                    type='submit'
                    id='createContact'
                >
                    שמור שינויים
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditInteractionEventDialog;

export interface Props {
    isOpen: boolean;
    eventToEdit: InteractionEventDialogData;
    closeEditDialog: () => void;
    loadInteractions: () => void;
    interactions: InteractionEventDialogData[];
};
