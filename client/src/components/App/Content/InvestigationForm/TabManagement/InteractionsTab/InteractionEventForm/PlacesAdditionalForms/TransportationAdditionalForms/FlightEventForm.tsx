import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import useStyles from './TransportationFormsStyles';
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const FlightEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const classes = useStyles();

    const countries : Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

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

    const onChange = (value: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});

    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='מספר טיסה'>
                        <AlphanumericTextField
                            className={classes.mainTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_NUM}
                            value={flightNum}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_NUM)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={2}>
                    <FormInput fieldName='חברת תעופה'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.AIR_LINE}
                            value={airline}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.AIR_LINE)}/>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='ארץ מוצא'>
                        <Autocomplete
                            options={Array.from(countries, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: flightOriginCountry as string, value: countries.get(flightOriginCountry as string)}}
                            onChange={(event, selectedCountry) => {
                                onChange(selectedCountry?.id as string, InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY);
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
                <Grid item xs={3} className={classes.secondaryTextItem}>
                    <FormInput fieldName='עיר מוצא' className={classes.secondaryTextLabel}>
                        <AlphanumericTextField
                            className={classes.secondaryTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_CITY}
                            value={flightOriginCity}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_ORIGIN_CITY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='שדה תעופה מוצא'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT}
                            value={flightOriginAirport}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT)}/>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='ארץ יעד'>
                        <Autocomplete
                            options={Array.from(countries, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: flightDestinationCountry as string, value: countries.get(flightDestinationCountry as string)}}
                            onChange={(event, selectedCountry) => {
                                onChange(selectedCountry?.id as string, InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY);
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
                <Grid item xs={3}>
                    <FormInput fieldName='עיר יעד'>
                        <AlphanumericTextField
                            className={classes.secondaryTextField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_CITY}
                            value={flightDestinationCity}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_DESTINATION_CITY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='שדה תעופה יעד'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT}
                            value={flightDestinationAirport}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT)}/>
                    </FormInput>
                </Grid>
            </Grid>
        </>
    );
};

export default FlightEventForm;