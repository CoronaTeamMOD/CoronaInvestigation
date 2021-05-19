import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { FormControl, Grid, TextField } from '@material-ui/core';
import { Controller ,DeepMap, FieldError } from 'react-hook-form';

import City from 'models/City';
import Street from 'models/Street';
import FlattenedDBAddress from 'models/DBAddress';
import StoreStateType from 'redux/storeStateType';
import { getStreetByCity } from 'Utils/Address/AddressUtils';

import useStyles from './AddressFormStyles';
import AlphanumericTextField from './AlphanumericTextField';

const CITY_LABEL = 'עיר';
const STREET_LABEL = 'רחוב';
const APARTMENT_LABEL = 'דירה';
const HOUSE_NUM_LABEL = 'מספר בית';
const UNKNOWN = 'לא ידוע';

const AddressForm: React.FC<Props> = ({ 
    disabled = false,
    unsized = false,
    cityField, 
    streetField,
    floorField, 
    apartmentField,
    houseNumberField,
    control,
    watch,
    errors
}) => {
    const classes = useStyles();

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const [streetsInCity, setStreetsInCity] = useState<Map<string, Street>>(new Map());

    const cityWatcher = watch(cityField.name);
    watch(streetField.name);
    watch(houseNumberField.name);
    apartmentField && watch(apartmentField.name);

    useEffect(() => {
        if (cityWatcher) {
            getStreetByCity(cityWatcher, setStreetsInCity);
        }
    }, [cityWatcher]);

    const apartmentFieldNameSplitted = apartmentField?.name.split('.');
    const smallFieldsClass = unsized ? [classes.fullHeight , classes.heightendTextField].join(' ') : classes.fullHeight;

    return (
        <Grid item container alignItems='stretch' spacing={2}>
            <Grid item className={cityField.className}>
                {
                    disabled ?
                    <Controller
                        name={cityField.name}
                        control={control}
                        defaultValue={cityField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <TextField 
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    value={cities.get(props.value)?.displayName} 
                                    label={CITY_LABEL}
                                    InputLabelProps={{ shrink: true }}
                                    disabled 
                                />
                            </FormControl>
                        )}
                    />
                    :
                    <Controller
                        name={cityField.name}
                        control={control}
                        defaultValue={cityField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <Autocomplete
                                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => option ? option.value?.displayName : option}
                                    value={props.value ? {id: props.value as string, value: cities.get(props.value) as City} : {id: '', value: {id: '', displayName: ''}}}
                                    onChange={(event, selectedCity) => props.onChange(selectedCity ? selectedCity.id : null)}
                                    renderInput={(params) => 
                                        <TextField
                                            error={Boolean(errors?.city)}
                                            test-id={cityField.testId || ''}
                                            label={errors?.city?.message || `${CITY_LABEL}`}
                                            {...params}
                                            placeholder={CITY_LABEL}
                                        />}
                                />
                            </FormControl>
                        )}
                    />
                }
            </Grid>
            <Grid item className={streetField.className}>
                {
                    disabled ?
                    <Controller
                        name={streetField.name}
                        control={control}
                        defaultValue={streetField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <TextField 
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    test-id={streetField.testId || ''} 
                                    value={streetsInCity.get(props.value)?.displayName} 
                                    label={STREET_LABEL} 
                                    InputLabelProps={{ shrink: true }}
                                    disabled 
                                />
                            </FormControl>
                        )}
                    />
                    :
                    <Controller
                        name={streetField.name}
                        control={control}
                        defaultValue={streetField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <Autocomplete
                                    options={Array.from(streetsInCity, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => {
                                        if (option) {
                                            if (option?.value) return option.value?.displayName
                                            else return '';
                                        } else return option
                                    }}
                                    value={props.value ? {id: props.value as string, value: streetsInCity.get(props.value) as Street} : {id: '', value: {id: '', displayName: ''}}}
                                    onChange={(event, selectedStreet) => 
                                        props.onChange(selectedStreet ? selectedStreet.id : '')
                                    }
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            error={Boolean(errors?.street)}
                                            test-id={streetField.testId || ''}
                                            label={errors?.street?.message || `${STREET_LABEL}`}
                                            placeholder={STREET_LABEL}
                                        />
                                    }
                                />
                            </FormControl>
                        )}
                    />
                }
            </Grid>

            <Grid item className={houseNumberField.className}>
                {
                    disabled ?
                    <Controller
                        name={houseNumberField.name}
                        control={control}
                        defaultValue={houseNumberField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <TextField 
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    test-id={houseNumberField.testId || UNKNOWN} 
                                    value={props.value} 
                                    label={HOUSE_NUM_LABEL} 
                                    InputLabelProps={{ shrink: true }}
                                    disabled
                                />
                            </FormControl>
                        )}
                    />
                    :
                    <Controller
                        name={houseNumberField.name}
                        control={control}
                        defaultValue={houseNumberField.defaultValue}
                        render={(props) => (
                            <FormControl variant='outlined' fullWidth>
                                <AlphanumericTextField
                                    name={props.name}
                                    error={errors?.houseNum?.message}
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    testId={houseNumberField.testId || ''}
                                    value={props.value}
                                    onChange={props.onChange}
                                    onBlur={props.onBlur}
                                    label={HOUSE_NUM_LABEL} 
                                    placeholder={HOUSE_NUM_LABEL}
                                />
                            </FormControl>
                        )}
                    />
                }
            </Grid>

            {
                apartmentField &&
                <Grid item className={apartmentField?.className}>
                    {
                        disabled ?
                        <Controller
                            name={apartmentField?.name || ''}
                            control={control}
                            defaultValue={apartmentField?.defaultValue}
                            render={(props) => (
                                <FormControl variant='outlined' fullWidth>
                                    <TextField 
                                        className={smallFieldsClass}
                                        InputProps={{className: smallFieldsClass}}
                                        test-id={apartmentField?.testId || ''} 
                                        value={props.value} 
                                        label={APARTMENT_LABEL} 
                                        InputLabelProps={{ shrink: true }}
                                        disabled={true} 
                                    />
                                </FormControl>
                            )}
                        />
                        :
                        <Controller
                            name={apartmentField?.name || ''}
                            control={control}
                            defaultValue={apartmentField?.defaultValue}
                            render={(props) => (
                                <FormControl variant='outlined' fullWidth>
                                    <AlphanumericTextField
                                        className={smallFieldsClass}
                                        error={errors?.apartment?.message}
                                        InputProps={{className: smallFieldsClass}}
                                        testId={apartmentField?.testId || ''}
                                        name={apartmentFieldNameSplitted ? apartmentFieldNameSplitted[apartmentFieldNameSplitted.length - 1] : ''}
                                        value={props.value}
                                        onChange={props.onChange}
                                        onBlur={props.onBlur}
                                        placeholder={APARTMENT_LABEL}
                                        label={APARTMENT_LABEL}
                                    />
                                </FormControl>
                            )}
                        />
                    }
                </Grid>
            }
        </Grid>
    )
};

interface FormField {
    name: string;
    className?: string;
    testId?: string;
    defaultValue?: any;
};

interface Props {
    disabled?: boolean;
    unsized?: boolean;
    cityField: FormField;
    streetField: FormField;
    houseNumberField: FormField;
    floorField?: FormField;
    apartmentField?: FormField;
    control: any;
    watch: any;
    errors?: DeepMap<FlattenedDBAddress , FieldError>;
};

export type AddressFormFields = Pick<Props, 'cityField' | 'streetField' | 'houseNumberField'> & Partial<Pick<Props, 'floorField' | 'apartmentField'>>;

export default AddressForm;