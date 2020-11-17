import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import Contact from 'models/Contact';
import { initAddress } from 'models/Address';
import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './NewInteractionEventDialogStyles';
import InteractionEventForm from '../InteractionEventForm/InteractionEventForm';

const initialDialogData = (startTime: Date, endTime: Date, contacts: Contact[], investigationId: number) : InteractionEventDialogData => ({
    placeType: '',
    placeSubType: null,
    investigationId,
    locationAddress: initAddress,
    startTime,
    endTime,
    externalizationApproval: false,
    unknownTime: false,
    contacts,
    contactPersonPhoneNumber: '',
    creationTime: new Date()
});

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { interactionDate, closeNewDialog, isOpen, loadInteractions } = props;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    
    const classes = useStyles();            

    return (
        <Dialog classes={{ paper: classes.dialogPaper }} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
                <DialogContent>
                    <InteractionEventForm 
                        interactionData={initialDialogData(interactionDate, interactionDate, [], epidemiologyNumber)}
                        loadInteractions={loadInteractions}
                        closeNewDialog={closeNewDialog}
                        closeEditDialog={()=>{}}
                    />
                </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button
                    test-id='cancelNewContactLocation'
                    onClick={() => closeNewDialog()}
                    color='default'
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton
                    form='interactionEventForm'
                    type='submit'
                    test-id='createContact'
                >
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;

export interface Props {
    isOpen: boolean;
    interactionDate: Date;
    closeNewDialog: () => void;
    loadInteractions: () => void;
}
