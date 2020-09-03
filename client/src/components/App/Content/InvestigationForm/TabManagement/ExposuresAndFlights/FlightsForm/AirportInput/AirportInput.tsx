import React, {Dispatch, SetStateAction} from 'react';
import {TextField} from '@material-ui/core';
import {Airport, City, Country} from '../FlightsForm';
import AutocompletedField from './AutoCompletedField/AutocompletedField';
import useFlightsInvestigation from '../../useFlightsInvestigation';
import useFormStyle from 'styles/formStyles';
import {AutocompletedFieldProps} from './AutoCompletedField/AutoCompletedFieldTypes';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

interface AirportInputProps {
    airport: Airport | null;
    setAirport: Dispatch<SetStateAction<Airport | null>>;
};

const AirportInput = ({airport, setAirport}: AirportInputProps) => {
    const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
    const [selectedCity, setSelectedCity] = React.useState<City | null>(null);

    // search states
    const [cityPrefix, setCityPrefix] = React.useState<string>('');
    const [airportPrefix, setAirportPrefix] = React.useState<string>('');

    // const {countries, cities, airports,} = useFlightsInvestigation({
    //     selectedCountry,
    //     selectedCity,
    //     cityPrefix,
    //     airportPrefix,
    // });

    const classes = useFormStyle();

    const onCountrySelect = (event: React.ChangeEvent<{}>, newValue: Country | null) => {
        setSelectedCountry(newValue);
    };

    const onCitySelect = (event: React.ChangeEvent<{}>, newValue: City | null) => {
        setSelectedCity(newValue);
        newValue && onCountrySelect(event, newValue.country);
    };

    const onAirportSelect = (event: React.ChangeEvent<{}>, newValue: Airport | null) => {
        setAirport(newValue);
        newValue && onCitySelect(event, newValue.city);
    };

    const onCityInput = (event: React.ChangeEvent<{}>,
                         newInputValue: string,) => {
        setCityPrefix(newInputValue);
    };

    const onAirportInput = (event: React.ChangeEvent<{}>,
                            newInputValue: string,) => {
        setAirportPrefix(newInputValue);
    };

    const inputsProps = [
        {
            constOptions: true,
            label: 'מדינה',
            value: selectedCountry,
            //   options: countries,
            options: [],
            onChange: onCountrySelect,
        } as AutocompletedFieldProps<Country>, {
            label: 'עיר',
            value: selectedCity,
            //  options: cities,
            options: [],
            onChange: onCitySelect,
            onInputChange: onCityInput
        } as AutocompletedFieldProps<City>, {
            label: 'שדה תעופה',
            value: airport,
            //    options: airports,
            options: [],
            onChange: onAirportSelect,
            onInputChange: onAirportInput,
        } as AutocompletedFieldProps<Airport>];
    ;
    // Fields are temporarily text inputs only
    // Autocomplete fields will be added when api is ready
    const AutocomplteFields = () =>
        inputsProps.map((props: AutocompletedFieldProps<any>) => <AutocompletedField {...props}/>)
    ;

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <CircleTextField label='מדינה'
                       InputLabelProps={{classes: {root: classes.roundedTextLabel}}}
                       />

            <CircleTextField label='עיר'
                       InputLabelProps={{classes: {root: classes.roundedTextLabel}}}
                       />

            <CircleTextField label='שדה תעופה'
                       InputLabelProps={{classes: {root: classes.roundedTextLabel}}}
                       />
        </div>
    );
};

export default AirportInput;