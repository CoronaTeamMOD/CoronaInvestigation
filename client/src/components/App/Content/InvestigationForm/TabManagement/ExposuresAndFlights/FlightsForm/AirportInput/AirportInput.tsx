import React, {Dispatch, SetStateAction} from 'react';
import {Airport, City, Country} from "../../ExposuresAndFlights";
import useFlightsInvestigation from "../../useFlightsInvestigation";
import AutocompletedField from "./AutoCompletedField/AutocompletedField";

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

    const {countries, cities, airports,} = useFlightsInvestigation({
        selectedCountry,
        selectedCity,
        cityPrefix,
        airportPrefix,
    });

    const onCountrySelect = (event: React.ChangeEvent<{}>, newValue: any | null) => {
        setSelectedCountry(newValue);
    };

    const onCitySelect = (event: React.ChangeEvent<{}>, newValue: City | null) => {
        setSelectedCity(newValue);
        newValue &&  onCountrySelect(event, newValue.country);
    };

    const onAirportSelect = (event: React.ChangeEvent<{}>, newValue: Airport | null) => {
        setAirport(newValue);
        newValue && onCitySelect(event, newValue.city);
    };

    const onCityInput = (event: React.ChangeEvent<{}>,
                         newInputValue: string,) => {
        console.log('cityPrefix', cityPrefix);
        setCityPrefix(newInputValue);
    };

    const onAirportInput = (event: React.ChangeEvent<{}>,
                            newInputValue: string,) => {
        setAirportPrefix(newInputValue);
    };

    // TODO make it work
    // React.useEffect(() => {
    //     setSelectedCity(null);
    // }, [selectedCountry]);
    //
    // React.useEffect(() => {
    //     setAirport(null);
    // }, [selectedCity]);

    return (
        <div style={{display: 'flex', justifyContent:'space-around'}}>
            <AutocompletedField
                constOptions
                label='מדינה'
                value={selectedCountry} options={countries}
                onChange={onCountrySelect}
            />
            <AutocompletedField
                label='עיר'
                value={selectedCity} options={cities}
                onChange={onCitySelect} onInputChange={onCityInput}
            />
            <AutocompletedField
                label='שדה תעופה'
                value={airport} options={airports}
                onChange={onAirportSelect} onInputChange={onAirportInput}
            />
        </div>
    );
};

export default AirportInput;