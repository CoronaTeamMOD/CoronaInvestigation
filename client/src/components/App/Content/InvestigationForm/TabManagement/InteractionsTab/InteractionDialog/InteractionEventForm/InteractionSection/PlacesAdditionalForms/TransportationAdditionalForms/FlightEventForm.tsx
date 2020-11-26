import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from '../../TransportationForms/TransportationFormsStyles';

const FlightEventForm: React.FC = (): JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const classes = useStyles();

    const countries: Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={2} className={classes.mainTextItem} fieldName='מספר טיסה'>
                    <Controller
                        name={InteractionEventDialogFields.FLIGHT_NUM}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                onBlur={props.onBlur}
                            />
                        )}
                    />
                </FormInput>
                    <FormInput xs={2} fieldName='חברת תעופה'>
                        <Controller
                            name={InteractionEventDialogFields.AIR_LINE}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                    <FormInput xs={3} className={classes.mainTextItem} fieldName='ארץ מוצא'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(countries, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: countries.get(props.value as string) }}
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
                    <FormInput xs={3} className={classes.secondaryTextItem} fieldName='עיר מוצא'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_CITY}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
                    <FormInput xs={3} fieldName='שדה תעופה מוצא'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>

            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                    <FormInput xs={3} className={classes.mainTextItem} fieldName='ארץ יעד'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(countries, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: countries.get(props.value as string) }}
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
                    <FormInput xs={3} className={classes.secondaryTextItem} fieldName='עיר יעד'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_CITY}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
                    <FormInput xs={3} fieldName='שדה תעופה יעד'>
                        <Controller
                            name={InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </Grid>
        </>
    );
};

export default FlightEventForm;
