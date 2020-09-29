import React, {useContext} from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import {Grid, TextField} from '@material-ui/core';
import StoreStateType from 'redux/storeStateType';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import useStyles from './TransportationFormsStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const BusEventForm : React.FC = () : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { busLine, busCompany, cityOrigin, boardingStation, cityDestination, endStation } = interactionEventDialogData;

    const onChange = (value: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});

    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='קו'>
                        <AlphanumericTextField
                            className={classes.mainTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.BUS_LINE}
                            value={busLine}
                            onChange={newValue => onChange(newValue as string, InteractionEventDialogFields.BUS_LINE)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={2} className={classes.secondaryTextItem}>
                    <FormInput fieldName='חברה'>
                        <AlphanumericTextField
                            className={classes.secondaryTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.BUS_COMPANY}
                            value={busCompany}
                            onChange={newValue => onChange(newValue as string, InteractionEventDialogFields.BUS_COMPANY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='עיר מוצא'>
                        <Autocomplete
                            className={classes.mainTextField}
                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: cityOrigin as string, value: cities.get(cityOrigin as string)}}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_ORIGIN)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.CITY_ORIGIN);
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    className={classes.mainTextField}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={2} className={classes.secondaryTextItem}>
                    <FormInput fieldName='תחנת עליה' className={classes.secondaryTextLabel}>
                        <AlphanumericTextField
                            className={classes.secondaryTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.BOARDING_STATION}
                            value={boardingStation}
                            onChange={newValue => onChange(newValue , InteractionEventDialogFields.BOARDING_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='עיר יעד'>
                        <Autocomplete
                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: cityDestination as string, value: cities.get(cityDestination as string)}}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_DESTINATION)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.CITY_DESTINATION);
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    className={classes.mainTextField}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={2} className={classes.secondaryTextItem}>
                    <FormInput fieldName='תחנת ירידה' className={classes.secondaryTextLabel}>
                        <AlphanumericTextField
                            className={classes.secondaryTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.END_STATION}
                            value={endStation}
                            onChange={newValue => onChange(newValue as string, InteractionEventDialogFields.END_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default BusEventForm;