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
import ContactsTabs from "../InteractionEventForm/ContactsTabs/ContactsTabs";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import InteractionDetailsForm from "../InteractionEventForm/InteractionDetailsForm/InteractionDetailsForm";

const initialDialogData = (startTime: Date, endTime: Date, contacts: Contact[], investigationId: number) : InteractionEventDialogData => ({
    placeType: '',
    placeSubType: null,
    investigationId,
    locationAddress: initAddress,
    startTime,
    endTime,
    unknownTime: false,
    externalizationApproval: null,
    contacts,
    contactPersonPhoneNumber: '',
    creationTime: new Date()
});

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { interactionDate, closeNewDialog, isOpen, loadInteractions, interactions } = props;
    const [isAddingContacts, setIsAddingContacts] = React.useState(false);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    
    const classes = useStyles();


    return (
        <Dialog classes={{ paper: classes.dialogPaper }} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
                <DialogContent>
                    <InteractionDetailsForm
                        isAddingContacts={isAddingContacts}
                        interactions={interactions}
                        interactionData={initialDialogData(interactionDate, interactionDate, [], epidemiologyNumber)}
                        loadInteractions={loadInteractions}
                        closeNewDialog={closeNewDialog}
                        closeEditDialog={()=>{}}
                        isNewInteraction={true}
                    />
                </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                {
                    isAddingContacts
                    ?  <Button variant='text' onClick={() => setIsAddingContacts(false)}>
                            <ChevronRight/>
                            חזרה ליצירת מקום
                        </Button>
                        : <Button variant='text' onClick={() => setIsAddingContacts(true)}>
                            המשך ליצירת מגעים
                            <ChevronLeft/>
                        </Button>
                }

                <div>
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
                </div>
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
    interactions: InteractionEventDialogData[];
}
