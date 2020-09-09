import React, {useState} from 'react';
import { startOfDay } from 'date-fns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import { initAddress } from 'models/Address';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './NewInteractionEventDialogStyles';
import {
    InteractionEventDialogProvider, initialDialogData, InteractionsEventDialogDataAndSet
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import useNewInteractionEventDialog from './useNewInteractionEventDialog';
import InteractionEventForm, { locationTypes, schoolLocationType, hospitalLocationType, transportationLocationType, defaultContact } from '../InteractionEventForm/InteractionEventForm';
import { hospitals } from '../InteractionEventForm/PlacesAdditionalForms/HospitalEventForm';
import { grades } from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import { transportationTypes } from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { eventDate, closeDialog, isOpen } = props;
    const { createNewInteractionEvent } = useNewInteractionEventDialog({closeDialog});

    const defaultDate = new Date(startOfDay(eventDate).toUTCString());

    const classes = useStyles();

    const epidemiologyNumber = useSelector<StoreStateType, string>(state => state.investigation.epidemiologyNumber);

    const [interactionEventDialogData, setInteractionEventDialogData] = 
        useState<InteractionEventDialogData>(
            initialDialogData(locationTypes[0], defaultDate, defaultDate, [defaultContact], epidemiologyNumber));
    const { locationType, startTime, endTime, externalizationApproval, contacts, locationSubType } = interactionEventDialogData;

    React.useEffect(() => {
        resetLocationForm();
    }, [locationType, locationSubType])
    
    const resetLocationForm = () => {
        setInteractionEventDialogData({
            investigationId: epidemiologyNumber,
            startTime,
            endTime,
            locationName: locationType === hospitalLocationType ? hospitals[0] : undefined,
            grade: grades[0],
            locationType,
            externalizationApproval,
            locationAddress: initAddress,
            contacts,
            locationSubType: defaultSubType()
        })
    }

    const defaultSubType = () => {
        if (locationSubType) return locationSubType;
        if (locationType === transportationLocationType) return transportationTypes[0];
    }
        
    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);

    /// TODO: can  fix grade?
    const onConfirm = () => createNewInteractionEvent({
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