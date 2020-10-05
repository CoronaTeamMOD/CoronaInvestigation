import React from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import useStyles from './TransportationFormsStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const TrainEventForm: React.FC = (): JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();

    const formClasses = useFormStyles();
    const classes = useStyles();

    const cities: Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='עיר מוצא'>
                        <Controller 
                            name={InteractionEventDialogFields.CITY_ORIGIN}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: cities.get(props.value as string)}}
                                    onChange={(event, selectedCity) => props.onChange(selectedCity?.id as string)}
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
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת עליה'>
                        <Controller 
                            name={InteractionEventDialogFields.BOARDING_STATION}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue : string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={2} className={classes.mainTextItem}>
                    <FormInput fieldName='עיר יעד'>
                        <Controller 
                            name={InteractionEventDialogFields.CITY_DESTINATION}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option.value?.displayName || ''}
                                    defaultValue={{ id: props.value as string, value: cities.get(props.value as string)}}
                                    onChange={(event, selectedCity) => props.onChange(selectedCity?.id as string)}
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
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת ירידה'>
                        <Controller 
                            name={InteractionEventDialogFields.END_STATION}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: String) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default TrainEventForm;
