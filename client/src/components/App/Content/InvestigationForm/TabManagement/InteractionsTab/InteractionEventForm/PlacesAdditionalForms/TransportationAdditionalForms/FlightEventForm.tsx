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
    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { flightNumber, airline, boardingCity, boardingCountry, endCity, endCountry } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <CircleTextField
                            value={flightNumber}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_NUMBER)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברת תעופה'>
                        <CircleTextField
                            value={airline}
                            onChange={event => onChange(event, InteractionEventDialogFields.AIR_LINE)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ מוצא'>
                        <CircleTextField
                            value={boardingCountry}
                            onChange={event => onChange(event, InteractionEventDialogFields.BOARDING_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <CircleTextField
                            value={boardingCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.BOARDING_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ יעד'>
                        <CircleTextField
                            value={endCountry}
                            onChange={event => onChange(event, InteractionEventDialogFields.END_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <CircleTextField
                            value={endCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.END_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default FlightEventForm;