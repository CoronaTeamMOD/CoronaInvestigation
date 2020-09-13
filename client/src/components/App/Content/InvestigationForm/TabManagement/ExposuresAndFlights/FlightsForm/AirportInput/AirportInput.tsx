import React, { Dispatch, SetStateAction } from "react";
import { Airport } from "../FlightFormTypes";
import Country from 'models/Country';
import AutocompletedField from "commons/AutoCompletedField/AutocompletedField";
import useFormStyle from "styles/formStyles";
import { AutocompletedFieldProps } from "commons/AutoCompletedField/AutoCompletedFieldTypes";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import LocationOptionItem from 'commons/LocationInputField/OptionItem/LocationOptionItem';
import StoreStateType from "redux/storeStateType";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

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

  const [input, setInput] = React.useState<string>('');

  const onInputChange = (event: React.ChangeEvent<{}>,
    newInputValue: string,) => {
    setInput(newInputValue);
  };
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
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <AutocompletedField
        value={country}
        options={options}
        onChange={(e, newValue) => handleChangeExposureDataAndFlightsField(countryFieldName, newValue.id)}
        onInputChange={onInputChange}
        getOptionLabel={(option) => getLabel(option)}
      />
      <CircleTextField
        value={city}
        placeholder="עיר"
        onChange={(e) => handleChangeExposureDataAndFlightsField(cityFieldName, e.target.value)}
        InputProps={{ classes: { input: classes.roundedTextLabel } }}
        InputLabelProps={{ classes: { root: classes.roundedTextLabel } }}
      />
      <CircleTextField
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
