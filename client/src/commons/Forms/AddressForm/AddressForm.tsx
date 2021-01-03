import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import City from 'models/City';
import Street from 'models/Street';
import StoreStateType from 'redux/storeStateType';
import { getStreetByCity } from 'Utils/Address/AddressUtils';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyle from './AddressFormStyles';

const AddressForm: React.FC<Props> = ({ 
    disabled = false,
    cityField, 
    streetField,
    floorField, 
    houseNumberField
}) => {
    const classes = useStyle();
    const methods = useFormContext();
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const [streetsInCity, setStreetsInCity] = React.useState<Map<string, Street>>(new Map());

    const cityWatcher = methods.watch(cityField.name);

    useEffect(() => {
        if (cityWatcher) {
            getStreetByCity(cityWatcher, setStreetsInCity);
        }
    }, [cityWatcher]);

    return (
        <>
            <Grid item xs={2} className={cityField.className}>
                {
                    disabled ?
                    <Controller
                        name={cityField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                value={cities.get(props.value)?.displayName} 
                                label='עיר' 
                                InputLabelProps={{ shrink: true }}
                                disabled 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={cityField.name}
                        control={methods.control}
                        render={(props) => (
                            <Autocomplete
                                disabled={disabled}
                                options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                getOptionLabel={(option) => option ? option.value.displayName : option}
                                value={props.value && {id: props.value as string, value: cities.get(props.value) as City}}
                                onChange={(event, selectedCity) => props.onChange(selectedCity ? selectedCity.id : '')}
                                renderInput={(params) =>
                                    <TextField
                                        test-id={cityField.testId || ''}
                                        error={Boolean(get(methods.errors, cityField.name))}
                                        label={get(methods.errors, cityField.name)?.message || 'עיר *'}
                                        {...params}
                                        placeholder='עיר'
                                    />}
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={2} className={streetField.className}>
                {
                    disabled ?
                    <Controller
                        name={streetField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={streetField.testId || ''} 
                                value={props.value} 
                                label='רחוב' 
                                InputLabelProps={{ shrink: true }}
                                disabled 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={streetField.name}
                        control={methods.control}
                        render={(props) => (
                            <Autocomplete
                                disabled={disabled}
                                options={Array.from(streetsInCity, ([id, value]) => ({ id, value }))}
                                getOptionLabel={(option) => {
                                    if (option) {
                                        if (option?.value) return option.value?.displayName
                                        else return '';
                                    } else return option
                                }}
                                value={props.value && {id: props.value as string, value: streetsInCity.get(props.value) as Street}}
                                onChange={(event, selectedStreet) => {
                                    props.onChange(selectedStreet ? selectedStreet.id : '')
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        test-id={streetField.testId || ''}
                                        {...params}
                                        placeholder='רחוב'
                                        label='רחוב'
                                    />
                                }
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={2} className={houseNumberField.className}>
                {
                    disabled ?
                    <Controller
                        name={houseNumberField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={houseNumberField.testId || ''} 
                                value={props.value} 
                                label='מספר הבית' 
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        )}
                    />
                    :
                    <Controller
                        name={houseNumberField.name}
                        control={methods.control}
                        render={(props) => (
                            <AlphanumericTextField
                                disabled={disabled}
                                testId={houseNumberField.testId || ''}
                                name={houseNumberField.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue)}
                                onBlur={props.onBlur}
                                placeholder='מספר הבית'
                                label='מספר הבית'
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={2} className={[floorField.className, classes.cancelWhiteSpace].join(' ')}>
                {
                    disabled ?
                    <Controller
                        name={floorField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={floorField.testId || ''} 
                                value={props.value} 
                                label='קומה' 
                                InputLabelProps={{ shrink: true }}
                                disabled={true} 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={floorField.name}
                        control={methods.control}
                        render={(props) => (
                            <AlphanumericTextField
                                disabled={disabled}
                                testId={cityField.testId || ''}
                                name={floorField.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue)}
                                onBlur={props.onBlur}
                                placeholder='קומה'
                                label='קומה'
                            />
                        )}
                    />
                }
            </Grid>
        </>
    )
};

interface FormField {
    name: string;
    className?: string;
    testId?: string;
}

interface Props {
    disabled?: boolean;
    cityField: FormField;
    streetField: FormField;
    houseNumberField: FormField;
    floorField: FormField;
}

export default AddressForm;