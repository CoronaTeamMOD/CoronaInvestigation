
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
    const { airline, 
        flightDestinationAirport,
        flightDestinationCity,
        flightDestinationCountry,
        flightNum,
        flightOriginAirport,
        flightOriginCity,
        flightOriginCountry
    } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <CircleTextField
                            value={flightNum}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_NUM)}/>
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
                            value={flightOriginCountry}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <CircleTextField
                            value={flightOriginCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_ORIGIN_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ יעד'>
                        <CircleTextField
                            value={flightDestinationCountry}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <CircleTextField
                            value={flightDestinationCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.FLIGHT_DESTINATION_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default FlightEventForm;