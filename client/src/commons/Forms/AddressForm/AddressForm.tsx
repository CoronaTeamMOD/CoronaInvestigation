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

const CITY_LABEL = 'עיר';
const STREET_LABEL = 'רחוב';
const FLOOR_LABEL = 'קומה';
const HOUSE_NUM_LABEL = 'מספר בית';
const UNKNOWN = 'לא ידוע';
const GRID_ITEM_SIZE = 2;

const AddressForm: React.FC<Props> = ({ 
    disabled = false,
    unsized = false,
    cityField, 
    streetField,
    floorField, 
    houseNumberField
}) => {
    const methods = useFormContext();
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const [streetsInCity, setStreetsInCity] = React.useState<Map<string, Street>>(new Map());

    const cityWatcher = methods.watch(cityField.name);

    useEffect(() => {
        if (cityWatcher) {
            getStreetByCity(cityWatcher, setStreetsInCity);
        }
    }, [cityWatcher]);

    const houseNumberFieldNameSplitted = houseNumberField.name.split('.');
    const floorFieldNameSplitted = floorField.name.split('.');

    return (
        <>
            <Grid item xs={unsized ? undefined : GRID_ITEM_SIZE} className={cityField.className}>
                {
                    disabled ?
                    <Controller
                        name={cityField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                value={cities.get(props.value)?.displayName || UNKNOWN} 
                                label={CITY_LABEL}
                                InputLabelProps={{ shrink: true }}
                                disabled 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={cityField.name}
                        control={methods.control}
                        defaultValue={cityField.defaultValue}
                        render={(props) => (
                            <Autocomplete
                                options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                getOptionLabel={(option) => option ? option.value.displayName : option}
                                value={props.value && {id: props.value as string, value: cities.get(props.value) as City}}
                                onChange={(event, selectedCity) => props.onChange(selectedCity ? selectedCity.id : '')}
                                renderInput={(params) =>
                                    <TextField
                                        test-id={cityField.testId || ''}
                                        error={Boolean(get(methods.errors, cityField.name))}
                                        label={get(methods.errors, cityField.name)?.message || `${CITY_LABEL} *`}
                                        {...params}
                                        placeholder={CITY_LABEL}
                                    />}
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={unsized ? undefined : GRID_ITEM_SIZE} className={streetField.className}>
                {
                    disabled ?
                    <Controller
                        name={streetField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={streetField.testId || ''} 
                                value={streetsInCity.get(props.value)?.displayName || UNKNOWN} 
                                label={STREET_LABEL} 
                                InputLabelProps={{ shrink: true }}
                                disabled 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={streetField.name}
                        control={methods.control}
                        defaultValue={streetField.defaultValue}
                        render={(props) => (
                            <Autocomplete
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
            <Grid item xs={unsized ? undefined : GRID_ITEM_SIZE} className={houseNumberField.className}>
                {
                    disabled ?
                    <Controller
                        name={houseNumberField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={houseNumberField.testId || UNKNOWN} 
                                value={props.value} 
                                label={HOUSE_NUM_LABEL} 
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        )}
                    />
                    :
                    <Controller
                        name={houseNumberField.name}
                        control={methods.control}
                        defaultValue={houseNumberField.defaultValue}
                        render={(props) => (
                            <AlphanumericTextField
                                testId={houseNumberField.testId || ''}
                                name={houseNumberFieldNameSplitted[houseNumberFieldNameSplitted.length - 1]}
                                value={props.value}
                                onChange={props.onChange}
                                onBlur={props.onBlur}
                                placeholder={HOUSE_NUM_LABEL}
                                label={HOUSE_NUM_LABEL}
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={unsized ? undefined : GRID_ITEM_SIZE} className={floorField.className}>
                {
                    disabled ?
                    <Controller
                        name={floorField.name}
                        control={methods.control}
                        render={(props) => (
                            <TextField 
                                test-id={floorField.testId || ''} 
                                value={props.value} 
                                label={FLOOR_LABEL} 
                                InputLabelProps={{ shrink: true }}
                                disabled={true} 
                            />
                        )}
                    />
                    :
                    <Controller
                        name={floorField.name}
                        control={methods.control}
                        defaultValue={floorField.defaultValue}
                        render={(props) => (
                            <AlphanumericTextField
                                testId={floorField.testId || ''}
                                name={floorFieldNameSplitted[floorFieldNameSplitted.length - 1]}
                                value={props.value}
                                onChange={props.onChange}
                                onBlur={props.onBlur}
                                placeholder={FLOOR_LABEL}
                                label={FLOOR_LABEL}
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
    defaultValue?: any;
}

interface Props {
    disabled?: boolean;
    unsized?: boolean;
    cityField: FormField;
    streetField: FormField;
    houseNumberField: FormField;
    floorField: FormField;
}

export default AddressForm;