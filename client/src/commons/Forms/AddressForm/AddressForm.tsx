import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

import City from 'models/City';
import Street from 'models/Street';
import StoreStateType from 'redux/storeStateType';
import { getStreetByCity } from 'Utils/Address/AddressUtils';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './AddressFormStyles';

const CITY_LABEL = 'עיר';
const STREET_LABEL = 'רחוב';
const FLOOR_LABEL = 'קומה';
const APARTMENT_LABEL = 'דירה';
const HOUSE_NUM_LABEL = 'מספר בית';
const UNKNOWN = 'לא ידוע';

const AddressForm: React.FC<Props> = ({ 
    disabled,
    unsized = false,
    cityField, 
    streetField,
    floorField, 
    apartmentField,
    houseNumberField,
    onBlur
}) => {
    const classes = useStyles();

    const methods = useFormContext();
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const [streetsInCity, setStreetsInCity] = useState<Map<string, Street>>(new Map());

    const cityWatcher = methods.watch(cityField.name);
    
    useEffect(() => {
        if (cityWatcher) {
            getStreetByCity(cityWatcher, setStreetsInCity);
        }
    }, [cityWatcher]);

    const floorFieldNameSplitted = floorField?.name.split('.');
    const apartmentFieldNameSplitted = apartmentField?.name.split('.');
    const smallFieldsClass = unsized ? [classes.fullHeight , classes.heightendTextField].join(' ') : classes.fullHeight;

    return (
        <Grid item xs={unsized ? 12 : 8} container alignItems='stretch' spacing={2}>
            <Grid item xs={unsized ? 12 : 3} className={cityField.className}>
                {
                    disabled ?
                    <Controller
                        name={cityField.name}
                        control={methods.control}
                        defaultValue={cityField.defaultValue}
                        render={(props) => (
                            <TextField 
                                className={smallFieldsClass}
                                InputProps={{className: smallFieldsClass}}
                                value={cities.get(props.value)?.displayName} 
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
                                getOptionLabel={(option) => option ? option.value?.displayName : option}
                                value={props.value ? {id: props.value as string, value: cities.get(props.value) as City} : {id: '', value: {id: '', displayName: ''}}}
                                onChange={(event, selectedCity) => {
                                    props.onChange(selectedCity ? selectedCity.id : null);
                                }}
                                onBlur={onBlur}
                                renderInput={(params) => 
                                    <TextField
                                        error={Boolean(get(methods.errors, cityField.name))}
                                        test-id={cityField.testId || ''}
                                        label={get(methods.errors, cityField.name)?.message || `${CITY_LABEL}`}
                                        placeholder={CITY_LABEL}
                                        {...params}
                                    />}
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={unsized ? 12 : 3} className={streetField.className}>
                {
                    disabled ?
                    <Controller
                        name={streetField.name}
                        control={methods.control}
                        defaultValue={streetField.defaultValue}
                        render={(props) => (
                            <TextField 
                                className={smallFieldsClass}
                                InputProps={{className: smallFieldsClass}}
                                test-id={streetField.testId || ''} 
                                value={streetsInCity.get(props.value)?.displayName} 
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
                                value={props.value ? {id: props.value as string, value: streetsInCity.get(props.value) as Street} : {id: '', value: {id: '', displayName: ''}}}
                                onChange={(event, selectedStreet) => {
                                    props.onChange(selectedStreet ? selectedStreet.id : '');
                                }}
                                onBlur={onBlur}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        error={Boolean(get(methods.errors, streetField.name))}
                                        test-id={streetField.testId || ''}
                                        label={get(methods.errors, streetField.name)?.message || `${STREET_LABEL}`}
                                        placeholder={STREET_LABEL}
                                    />
                                }
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={unsized ? 12 : 2} className={houseNumberField.className}>
                {
                    disabled ?
                    <Controller
                        name={houseNumberField.name}
                        control={methods.control}
                        defaultValue={houseNumberField.defaultValue}
                        render={(props) => (
                            <TextField 
                                className={smallFieldsClass}
                                InputProps={{className: smallFieldsClass}}
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
                                name={props.name}
                                className={smallFieldsClass}
                                InputProps={{className: smallFieldsClass}}
                                testId={houseNumberField.testId || ''}
                                value={props.value}
                                label={HOUSE_NUM_LABEL} 
                                onChange={ props.onChange}
                                onBlur={()=>{
                                    props.onBlur();
                                    onBlur();
                                }}
                                placeholder={HOUSE_NUM_LABEL}
                            />
                        )}
                    />
                }
            </Grid>
            {
                floorField &&
                <Grid item xs={unsized ? 12 : 2} className={floorField?.className}>
                    {
                        disabled ?
                        <Controller
                            name={floorField?.name || ''}
                            control={methods.control}
                            render={(props) => (
                                <TextField 
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    test-id={floorField?.testId || ''} 
                                    value={props.value} 
                                    label={FLOOR_LABEL} 
                                    InputLabelProps={{ shrink: true }}
                                    disabled={true} 
                                />
                            )}
                        />
                        :
                        <Controller
                            name={floorField?.name || ''}
                            control={methods.control}
                            defaultValue={floorField?.defaultValue}
                            render={(props) => (
                                <AlphanumericTextField
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    testId={floorField?.testId || ''}
                                    name={floorFieldNameSplitted ? floorFieldNameSplitted[floorFieldNameSplitted.length - 1] : ''}
                                    value={props.value}
                                    onChange={props.onChange}
                                    onBlur={()=>{
                                        props.onBlur();
                                        onBlur();
                                    }}
                                    placeholder={FLOOR_LABEL}
                                    label={FLOOR_LABEL}
                                />
                            )}
                        />
                    }
                </Grid>
            }
            {
                apartmentField &&
                <Grid item xs={unsized ? 12 : 2} className={apartmentField?.className}>
                    {
                        disabled ?
                        <Controller
                            name={apartmentField?.name || ''}
                            control={methods.control}
                            defaultValue={apartmentField?.defaultValue}
                            render={(props) => (
                                <TextField 
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    test-id={apartmentField?.testId || ''} 
                                    value={props.value} 
                                    label={APARTMENT_LABEL} 
                                    InputLabelProps={{ shrink: true }}
                                    disabled={true} 
                                />
                            )}
                        />
                        :
                        <Controller
                            name={apartmentField?.name || ''}
                            control={methods.control}
                            defaultValue={apartmentField?.defaultValue}
                            render={(props) => (
                                <AlphanumericTextField
                                    className={smallFieldsClass}
                                    InputProps={{className: smallFieldsClass}}
                                    testId={apartmentField?.testId || ''}
                                    name={apartmentFieldNameSplitted ? apartmentFieldNameSplitted[apartmentFieldNameSplitted.length - 1] : ''}
                                    value={props.value}
                                    onChange={props.onChange}
                                    onBlur={()=>{
                                        props.onBlur();
                                        onBlur();
                                    }}
                                    placeholder={APARTMENT_LABEL}
                                    label={APARTMENT_LABEL}
                                />
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
    onBlur?: any;
};

export type AddressFormFields = Pick<Props, 'cityField' | 'streetField' | 'houseNumberField'> & Partial<Pick<Props, 'floorField' | 'apartmentField'>>;

export default AddressForm;