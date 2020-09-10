import {Grid} from '@material-ui/core';
import React, {useContext} from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import AutocompletedField from 'commons/AutoCompletedField/AutocompletedField';

const BusEventForm : React.FC = () : JSX.Element => {
    
    const formClasses = useFormStyles();

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { busLine, busCompany, cityOrigin, boardingStation, cityDestination, endStation } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value as string});

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
                            value={cityOrigin}
                            onChange={event => onChange(event, InteractionEventDialogFields.CITY_ORIGIN)}/>
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
                            value={cityDestination}
                            onChange={event => onChange(event, InteractionEventDialogFields.CITY_DESTINATION)}/>
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