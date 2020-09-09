import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
    
import { initAddress } from 'models/Address';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './EditInteractionEventDialogStyles';
import useEditInteractionEventDialog from './useEditInteractionEventDialog';
import {
    InteractionEventDialogProvider, InteractionsEventDialogDataAndSet
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import { grades } from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import { hospitals } from '../InteractionEventForm/PlacesAdditionalForms/HospitalEventForm';
import { transportationTypes } from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import InteractionEventForm, { schoolLocationType, hospitalLocationType, transportationLocationType } from '../InteractionEventForm/InteractionEventForm';

const newContactEventTitle = 'עריכת מקום/מגע';

const EditInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { closeDialog, eventToEdit, isOpen } = props;
    const { editInteractionEvent } = useEditInteractionEventDialog({closeDialog});
    
    const classes = useStyles();
    
    const [interactionEventDialogData, setInteractionEventDialogData] = useState<InteractionEventDialogData>(eventToEdit);
    const { locationType, startTime, endTime, externalizationApproval, contacts, locationSubType } = interactionEventDialogData;
    
    React.useEffect(() => {
        resetLocationForm(locationType === eventToEdit.locationType);
    }, [locationType])

    React.useEffect(() => {
        resetLocationForm(locationSubType === eventToEdit.locationSubType);
    }, [locationSubType])

    const resetLocationForm = (isOriginalLocationType: boolean) => {

        if (isOriginalLocationType) setInteractionEventDialogData(eventToEdit)
        else setInteractionEventDialogData({
            investigationId: eventToEdit.investigationId,
            locationSubType: defaultSubType(),
            startTime,
            endTime,
            locationName: locationType === hospitalLocationType ? hospitals[0] : undefined,
            grade: grades[0],
            locationType,
            externalizationApproval,
            locationAddress: initAddress,
            contacts
        })
    }

    const defaultSubType = () => {
        if (locationSubType && locationType === eventToEdit.locationType) return locationSubType;
        if (locationType === transportationLocationType) return transportationTypes[0];
    }
    
    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);

    /// TODO: can  fix grade?
    const onConfirm = () => editInteractionEvent({
        ...interactionEventDialogData,
        grade: interactionEventDialogData.locationType === schoolLocationType ? interactionEventDialogData.grade : undefined,
    })

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
                    שמור שינויים
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditInteractionEventDialog;

export interface Props {
    closeDialog: () => void,
    isOpen: boolean,
    eventToEdit: InteractionEventDialogData
}