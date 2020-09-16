import React, { Dispatch, SetStateAction } from 'react';
import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';
import { createFilterOptions } from '@material-ui/lab';

import Country from 'models/Country';
import useFormStyle from 'styles/formStyles';
import AutocompletedField from 'commons/AutoCompletedField/AutocompletedField';

import { Airport } from '../FlightFormTypes';
import { TextField } from '@material-ui/core';


interface AirportInputProps {
  airport: Airport | undefined;
  setAirport: Dispatch<SetStateAction<Airport | undefined>>;
}

const AirportInput = (props: any) => {
  const {
    country,
    countryFieldName,
    city,
    cityFieldName,
    airport,
    airportFieldName,
    handleChangeExposureDataAndFlightsField,
  } = props;
  const classes = useFormStyle();

  const countries = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);
  const options = Array.from(countries).map(([name, value]) => (value))
  const getLabel = (option: any) => {
    if (option.displayName) {
      return option.displayName
    }
    else if (option !== '')
      return countries.get(option)?.displayName
    else return ''

  }

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: Country) => option.displayName,
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <AutocompletedField
        required
        value={country}
        options={options}
        onChange={(e, newValue) => handleChangeExposureDataAndFlightsField(countryFieldName, newValue?.id)}
        getOptionLabel={(option) => getLabel(option)}
        filterOptions={filterOptions}
      />
      <TextField
        required
        value={city}
        placeholder="עיר"
        onChange={(e) => handleChangeExposureDataAndFlightsField(cityFieldName, e.target.value)}
        InputProps={{ classes: { input: classes.roundedTextLabel } }}
        InputLabelProps={{ classes: { root: classes.roundedTextLabel } }}
      />
      <TextField
        required
        value={airport}
        onChange={(e) => handleChangeExposureDataAndFlightsField(airportFieldName, e.target.value)}
        placeholder="שדה תעופה"
        InputProps={{ classes: { input: classes.roundedTextLabel } }}
        InputLabelProps={{ classes: { root: classes.roundedTextLabel } }}
      />
    </div>
  );
};

export default AirportInput;
