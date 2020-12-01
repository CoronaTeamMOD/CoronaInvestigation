import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import {ChevronLeft, ChevronRight} from '@material-ui/icons';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import {InteractionEventFormProps} from './InteractionEventForm/InteractionSection/InteractionEventForm';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionDetailsForm from './InteractionEventForm/InteractionDetailsForm';
import useStyles from './InteractionDialogStyles';

const InteractionDialog = (props: Props) => {
    const { isOpen, dialogTitle, loadInteractions, interactions, onDialogClose, interactionData, isNewInteraction } = props;
    const [isAddingContacts, setIsAddingContacts] = React.useState(false);
    const classes = useStyles();
    const hebrewActionName = isNewInteraction ? 'יצירת' : 'עריכת';

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <InteractionDetailsForm
                    isAddingContacts={isAddingContacts}
                    interactions={interactions}
                    interactionData={interactionData}
                    loadInteractions={loadInteractions}
                    onDialogClose={onDialogClose}
                    isNewInteraction={isNewInteraction}
                />
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                {
                    isAddingContacts
                        ?  <Button variant='text' onClick={() => setIsAddingContacts(false)}>
                            <ChevronRight/>
                            חזרה ל{hebrewActionName} מקום
                        </Button>
                        : <Button variant='text' onClick={() => setIsAddingContacts(true)}>
                            המשך ל{hebrewActionName} מגעים
                            <ChevronLeft/>
                        </Button>
                }

                <div>
                    <Button
                        onClick={onDialogClose}
                        color='default'
                        className={classes.cancelButton}>
                        בטל
                    </Button>
                    <PrimaryButton
                        form='interactionEventForm'
                        type='submit'
                        id='createContact'
                    >
                        צור מקום ומגעים
                    </PrimaryButton>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default InteractionDialog;

interface Props {
    isOpen: boolean;
    dialogTitle:string;
    interactionData?: InteractionEventFormProps['interactionData'];
    isNewInteraction:InteractionEventFormProps['isNewInteraction'];
    onDialogClose: () => void;
    loadInteractions: () => void;
    interactions: InteractionEventDialogData[];
    testIds: Record<DialogTestIds, string>;
};

type DialogTestIds = 'cancelButton' | 'submitButton';
