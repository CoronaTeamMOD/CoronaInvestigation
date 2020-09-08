import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const BusEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { busLine, busCompany, boardingCity, boardingStation, endCity, endStation } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='קו'>
                        <CircleTextField
                            value={busLine}
                            onChange={event => onChange(event, InteractionEventDialogFields.BUS_LINE)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברה'>
                        <CircleTextField
                            value={busCompany}
                            onChange={event => onChange(event, InteractionEventDialogFields.BUS_COMPANY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <CircleTextField
                            value={boardingCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.BOARDING_CITY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת עליה'>
                        <CircleTextField
                            value={boardingStation}
                            onChange={event => onChange(event, InteractionEventDialogFields.BOARDING_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <CircleTextField
                            value={endCity}
                            onChange={event => onChange(event, InteractionEventDialogFields.END_CITY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת ירידה'>
                        <CircleTextField
                            value={endStation}
                            onChange={event => onChange(event, InteractionEventDialogFields.END_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default BusEventForm;