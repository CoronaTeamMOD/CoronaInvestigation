
import { Grid, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { useForm } from "react-hook-form";

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const FlightEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

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
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_NUM}
                            value={flightNum}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_NUM)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
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
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
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
                                    className={formClasses.autocomplete}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_CITY}
                            value={flightOriginCity}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_ORIGIN_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
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
                                className={formClasses.autocomplete}
                            />
                        }
                    />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_CITY}
                            value={flightDestinationCity}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.FLIGHT_DESTINATION_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default FlightEventForm;