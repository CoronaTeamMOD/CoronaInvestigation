import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { createFilterOptions } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import AutocompletedField from 'commons/AutoCompletedField/AutocompletedField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './AirportInputStyles';

const AirportInput = (props: any) => {
    const {
        country,
        countryFieldName,
        city,
        cityFieldName,
        airport,
        airportFieldName,
        handleChangeExposureDataAndFlightsField,
        index,
    } = props;

    const { control, errors } = useFormContext();

    const classes = useStyles();
    const formStyles = useFormStyles();

    const countries = useSelector<StoreStateType, Map<string, Country>>((state) => state.countries);
    const options = Array.from(countries).map(([name, value]) => value);

    const getLabel = (option: any) => {
        if (option.displayName) {
            return option.displayName;
        } else if (option !== '') return countries.get(option)?.displayName;
        else return '';
    };

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option: Country) => option.displayName,
    });

    const handleCountryChange = (selectedCountry: Country | null) => {
        handleChangeExposureDataAndFlightsField(countryFieldName, selectedCountry ? selectedCountry.id : null);
    };

    const getCountryLabel = (countryError: { message?: string; type?: string }) => {
        if (countryError) {
            return countryError.message;
        }
        return 'מדינה';
    };

    const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
    const countryFieldError = currentErrors ? currentErrors[countryFieldName] : undefined;

    return (
        <Grid container item xs={9} className={formStyles.inputRow} justify='flex-start' alignItems='center' spacing={1}>
            <Grid item xs={4}>
                <div className={classes.countryAutocomplete}>
                    <Controller
                        control={control}
                        name={`exposures[${index}].${countryFieldName}`}
                        defaultValue={country}
                        render={(props) => {
                            return (
                                <AutocompletedField
                                    {...props}
                                    options={options}
                                    onChange={(event, newValue) => {
                                        const formattedValue = newValue ? newValue.id : null;
                                        props.onChange(formattedValue);
                                        handleCountryChange(newValue);
                                    }}
                                    getOptionLabel={(option) => getLabel(option)}
                                    filterOptions={filterOptions}
                                    error={Boolean(countryFieldError)}
                                    label={getCountryLabel(countryFieldError)}
                                    placeholder='מדינה'
                                />
                            );
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={4} lg={3}>
                <Controller
                    control={control}
                    name={`exposures[${index}].${cityFieldName}`}
                    defaultValue={city}
                    render={(props) => {
                        return (
                            <AlphanumericTextField
                                {...props}
                                onChange={(value) => {
                                    props.onChange(value);
                                    handleChangeExposureDataAndFlightsField(cityFieldName, value);
                                }}
                                placeholder='עיר'
                                label='עיר'
                            />
                        );
                    }}
                />
            </Grid>
            <Grid item xs={4} lg={3}>
                <Controller
                    control={control}
                    name={`exposures[${index}].${airportFieldName}`}
                    defaultValue={airport}
                    render={(props) => {
                        return (
                            <AlphanumericTextField
                                {...props}
                                onChange={(value) => {
                                    props.onChange(value);
                                }}
                                placeholder='שדה תעופה'
                                label='שדה תעופה'
                                className={classes.airportTextField}
                            />
                        );
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default AirportInput;
