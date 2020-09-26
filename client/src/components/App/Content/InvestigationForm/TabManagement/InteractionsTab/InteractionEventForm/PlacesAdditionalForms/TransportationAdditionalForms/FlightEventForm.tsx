
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';

import Country from 'models/Country';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import StoreStateType from 'redux/storeStateType';
import useFormStyles from 'styles/formStyles';

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const FlightEventForm : React.FC = () : JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();
    const formClasses = useFormStyles();

    const countries : Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName='מספר טיסה'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_NUM}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.FLIGHT_NUM}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <FormInput fieldName='חברת תעופה'>
                        <Controller 
                            name={InteractionEventDialogFields.AIR_LINE}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.AIR_LINE}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName='ארץ מוצא'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(countries, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: countries.get(props.value as string)}}
                                    onChange={(event, selectedCountry) => props.onChange(selectedCountry?.id as string)}
                                    onInputChange={(event, newInputValue) => {
                                        if (newInputValue === '') {
                                            props.onChange('', );
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            className={formClasses.autocomplete}
                                        />
                                    }
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <FormInput fieldName='עיר מוצא'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_CITY}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.FLIGHT_ORIGIN_CITY}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />             
                    </FormInput>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <FormInput fieldName='שדה תעופה מוצא'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName='ארץ יעד'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(countries, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: countries.get(props.value as string)}}
                                    onChange={(event, selectedCountry) => props.onChange(selectedCountry?.id as string)}
                                    onInputChange={(event, newInputValue) => {
                                        if (newInputValue === '') {
                                            props.onChange('');
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            className={formClasses.autocomplete}
                                        />
                                    }
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <FormInput fieldName='עיר יעד'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_CITY}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.FLIGHT_DESTINATION_CITY}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <FormInput fieldName='שדה תעופה יעד'>
                        <Controller 
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </Grid>
        </>
    );
};

export default FlightEventForm;