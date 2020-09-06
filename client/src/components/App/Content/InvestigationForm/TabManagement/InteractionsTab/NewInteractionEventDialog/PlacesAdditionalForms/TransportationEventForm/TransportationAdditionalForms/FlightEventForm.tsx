import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const FlightEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onFlightNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onAirlineChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});
    
    const onBoardingCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});
    
    const onBoardingCountryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onEndCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});
    
    const onEndCountryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <CircleTextField
                            onBlur={event => onFlightNumberChange(event, InteractionEventDialogFields.FLIGHT_NUMBER)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברת תעופה'>
                        <CircleTextField
                            onBlur={event => onAirlineChange(event, InteractionEventDialogFields.AIR_LINE)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ מוצא'>
                        <CircleTextField
                            onBlur={event => onBoardingCountryChange(event, InteractionEventDialogFields.BOARDING_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <CircleTextField
                            onBlur={event => onBoardingCityChange(event, InteractionEventDialogFields.BOARDING_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ יעד'>
                        <CircleTextField
                            onBlur={event => onEndCountryChange(event, InteractionEventDialogFields.END_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <CircleTextField
                            onBlur={event => onEndCityChange(event, InteractionEventDialogFields.END_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default FlightEventForm;