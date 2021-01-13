import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import useStyles from './TransportationFormsStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';


const TrainEventForm: React.FC = (): JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const classes = useStyles();

    const cities: Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <div className={formClasses.formRow}>
                    <FormInput xs={4} className={classes.mainTextItem} fieldName='עיר מוצא'>
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

                    <FormInput xs={4} fieldName='תחנת עליה'>
                        <Controller
                            name={InteractionEventDialogFields.BOARDING_STATION}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue : string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </div>
            <div className={formClasses.formRow}>
                    <FormInput xs={4} className={classes.mainTextItem} fieldName='עיר יעד'>
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
                    <FormInput xs={4} fieldName='תחנת ירידה'>
                        <Controller 
                            name={InteractionEventDialogFields.END_STATION}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: String) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </div>
        </>
    );
};

export default TrainEventForm;
