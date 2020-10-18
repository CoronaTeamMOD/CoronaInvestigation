import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { createFilterOptions } from '@material-ui/lab';

import Country from 'models/Country';
import AutocompletedField from 'commons/AutoCompletedField/AutocompletedField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useFormStyles from 'styles/formStyles';
import useStyles from './AirportInputStyles';

const AirportInput = (props: any) => {
    const { country, countryFieldName, city, cityFieldName, airport, airportFieldName, handleChangeExposureDataAndFlightsField} = props;

    const classes = useStyles();
    const formStyles = useFormStyles();

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
        handleChangeExposureDataAndFlightsField(countryFieldName, selectedCountry?.id);
    };

    return (
        <div className={formStyles.inputRow}>
            <>
                <AutocompletedField
                    value={country}
                    options={options}
                    onChange={(event, newValue) => handleCountryChange(newValue)}
                    getOptionLabel={(option) => getLabel(option)}
                    filterOptions={filterOptions}
                    label='מדינה'
                    placeholder='מדינה'
                />
            </>
            <>
                <AlphanumericTextField
                    name={cityFieldName}
                    value={city}
                    onChange={(value) => handleChangeExposureDataAndFlightsField(cityFieldName, value)}
                    placeholder='עיר'
                    label='עיר'
                />
                <AlphanumericTextField
                    name={airportFieldName}
                    value={airport}
                    onChange={(value) => handleChangeExposureDataAndFlightsField(airportFieldName, value)}
                    placeholder='שדה תעופה'
                    label='שדה תעופה'
                    className={classes.airportTextField}
                />
            </>
        </div>
    );
};

export default AirportInput;
