import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { createFilterOptions } from '@material-ui/lab';

import Country from 'models/Country';
import AutocompletedField from 'commons/AutoCompletedField/AutocompletedField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './AirportInputStyles';

const AirportInput = (props: any) => {
    const { errors, setError, clearErrors, country, countryFieldName, city, cityFieldName, airport,
            airportFieldName, handleChangeExposureDataAndFlightsField,
    } = props;

    const classes = useStyles();

    const [countryToShow, setCountryToShow] = useState<Country | null>(country);
    
    const countries = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);
    const options = Array.from(countries).map(([name, value]) => (value));

    const getLabel = (option: any) => {
        if (option.displayName) {
            return option.displayName
        } else if (option !== '')
            return countries.get(option)?.displayName
        else return ''
    }

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option: Country) => option.displayName,
    });

    const handleCountryChange = (selectedCountry: Country | null) => {
        setCountryToShow(selectedCountry);
        handleChangeExposureDataAndFlightsField(countryFieldName, selectedCountry?.id);
    };

    return (
        <div className={classes.airportDetails}>
            <div className={classes.airportCountryTextField}>
                <AutocompletedField
                    value={countryToShow}
                    options={options}
                    onChange={(event, newValue) => handleCountryChange(newValue)}
                    getOptionLabel={(option) => getLabel(option)}
                    filterOptions={filterOptions}
                    label='מדינה'
                    placeholder='מדינה'
                />
            </div>
            <div>
                <AlphanumericTextField
                    name={cityFieldName}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    value={city}
                    placeholder='עיר'
                    label='עיר'
                    onChange={(value) => handleChangeExposureDataAndFlightsField(cityFieldName, value)}
                />
                <AlphanumericTextField
                    className={classes.airportTextField}
                    name={airportFieldName}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    value={airport}
                    onChange={(value) => handleChangeExposureDataAndFlightsField(airportFieldName, value)}
                    placeholder='שדה תעופה'
                    label='שדה תעופה'
                />
            </div>
        </div>
    );
};

export default AirportInput;
