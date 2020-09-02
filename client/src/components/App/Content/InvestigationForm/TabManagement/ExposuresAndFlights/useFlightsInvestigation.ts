import React from 'react';
import axios from 'axios';
import server from 'Utils/axios'
import {Dispatch, SetStateAction} from "react";
import {Country} from "./ExposuresAndFlights";

interface FlightsInvestigationProps {
    selectedCity: Country| null;
    cityPrefix: string | undefined;
    selectedCountry:Country|null;
    airportPrefix: string | undefined;
    // setCityId: Dispatch<SetStateAction<number|undefined>>;
}

const useFlightsInvestigation = ({selectedCountry, selectedCity, airportPrefix, cityPrefix}: FlightsInvestigationProps) => {
    const citiesApi = '/cities';
    const airportsApi = '/airports';

    const currentAirport = 'LLBG';

    const [cities, setCities] = React.useState([]);
    const [airports, setAirports] = React.useState([]);

    const countries = [
            {
                id: "MAURITIUS",
                name: "",
            },
            {
                id: "UZBEKISTAN",
                name: "אוזבקיסטן",
            },
            {
                id: "AUSTRIA",
                name: "אוסטריה",
            },
            {
                id: "UKRAINE",
                name: "אוקראינה",
            },
            {
                id: "AZERBAIJAN",
                name: "אזרביג'אן",
            },
            {
                id: "UNITED ARAB EMIRATES",
                name: "איחוד האמירויות",
            },
            {
                id: "ITALY",
                name: "איטליה",
            },
            {
                id: "SEYCHELLES",
                name: "איי סיישל",
            },
            {
                id: "IRELAND",
                name: "אירלנד",
            },
            {
                id: "ALBANIA",
                name: "אלבניה",
            },
            {
                id: "ARMENIA",
                name: "ארמניה",
            },
            {
                id: "UNITED STATES",
                name: "ארצות הברית",
            },
            {
                id: "ETHIOPIA",
                name: "אתיופיה",
            },
            {
                id: "BULGARIA",
                name: "בולגריה",
            },
            {
                id: "BOSNIA",
                name: "בוסניה",
            },
            {
                id: "BELARUS",
                name: "בלארוס",
            },
            {
                id: "BELGIUM",
                name: "בלגיה",
            },
            {
                id: "BRAZIL",
                name: "ברזיל",
            },
            {
                id: "UNITED KINGDOM",
                name: "בריטניה",
            },
            {
                id: "GEORGIA",
                name: "גיאורגיה",
            },
            {
                id: "GERMANY",
                name: "גרמניה",
            },
            {
                id: "DENMARK",
                name: "דנמרק",
            },
            {
                id: "SOUTH AFRICA",
                name: "דרום אפריקה",
            },
            {
                id: "SOUTH KOREA",
                name: "דרום קוריאה",
            },
            {
                id: "MALDIVES",
                name: "האיים המאלדיביים",
            },
            {
                id: "INDIA",
                name: "הודו",
            },
            {
                id: "NETHERLANDS",
                name: "הולנד",
            },
            {
                id: "HUNGARY",
                name: "הונגריה",
            },
            {
                id: "TURKEY",
                name: "טורקיה",
            },
            {
                id: "TANZANIA",
                name: "טנזניה",
            },
            {
                id: "GREECE",
                name: "יוון",
            },
            {
                id: "JAPAN",
                name: "יפן",
            },
            {
                id: "JORDAN",
                name: "ירדן",
            },
            {
                id: "ISRAEL",
                name: "ישראל",
            },
            {
                id: "LATVIA",
                name: "לטביה",
            },
            {
                id: "LITHUANIA",
                name: "ליטא",
            },
            {
                id: "MOLDOVA",
                name: "מולדוביה",
            },
            {
                id: "MONTENEGRO",
                name: "מונטנגרו",
            },
            {
                id: "MALTA",
                name: "מלטה",
            },
            {
                id: "EGYPT",
                name: "מצרים",
            },
            {
                id: "MACEDONIA",
                name: "מקדוניה",
            },
            {
                id: "NORWAY",
                name: "נורבגיה",
            },
            {
                id: "CHINA",
                name: "סין",
            },
            {
                id: "SLOVENIA",
                name: "סלובניה",
            },
            {
                id: "SLOVAKIA",
                name: "סלובקיה",
            },
            {
                id: "SPAIN",
                name: "ספרד",
            },
            {
                id: "SERBIA",
                name: "סרביה",
            },
            {
                id: "SRI LANKA",
                name: "סרילנקה",
            },
            {
                id: "POLAND",
                name: "פולין",
            },
            {
                id: "PORTUGAL",
                name: "פורטוגל",
            },
            {
                id: "FINLAND",
                name: "פינלנד",
            },
            {
                id: "CHILE",
                name: "צ'ילה",
            },
            {
                id: "CZECH REPUBLIC",
                name: "צ'כיה",
            },
            {
                id: "FRANCE",
                name: "צרפת",
            },
            {
                id: "CANADA",
                name: "קנדה",
            },
            {
                id: "CYPRUS",
                name: "קפריסין",
            },
            {
                id: "CROATIA",
                name: "קרואטיה",
            },
            {
                id: "RWANDA",
                name: "רואנדה",
            },
            {
                id: "ROMANIA",
                name: "רומניה",
            },
            {
                id: "RUSSIAN FEDERATION",
                name: "רוסיה",
            },
            {
                id: "SWEDEN",
                name: "שבדיה",
            },
            {
                id: "SWITZERLAND",
                name: "שוויץ",
            },
            {
                id: "THAILAND",
                name: "תאילנד",
            }
        ];

    const formatAirportData = (results:any) => results.data.d.map((data:any) => ({
        name: data.AirPortName,
        city: {
            id:  data.City.CityID,
            name: data.City.CityHebName || data.City.CityEngName,
            country: {
                id:  data.City.Country.CountryID,
                name: data.City.Country.CountryHebName || data.City.Country.CountryEngName
            }
        },
    }));

    const formatCityData  = (results:any) => results.data.d.map((data:any) => ({
        name: data.CityHebName || data.CityEngName,
        id: data.CityID,
        country: {
            id:  data.Country.CountryID,
            name: data.Country.CountryHebName || data.Country.CountryEngName
        }
    }));

    const handleFetchAirports = () => getAirports().then(formatAirportData).then(setAirports);

    const handleFetchCities = () => getCities().then(formatCityData).then(setCities);


    React.useEffect(() => {
        handleFetchCities().catch(e => {});
    }, [selectedCountry, cityPrefix]);

    React.useEffect(() => {
        handleFetchAirports().catch(e => {});
    }, [selectedCity, airportPrefix]);

    const getAirports = () =>
        server.post(airportsApi, {
            currentAirport,
            cityId: selectedCity ? selectedCity.id : '',
            prefix: airportPrefix
        })

    const getCities = () =>
        server.post(citiesApi, {
            currentAirport,
            countryId: selectedCountry ? selectedCountry.id : '',
            prefix: cityPrefix
        });

    return {
        handleFetchAirports,
        handleFetchCities,
        airports,
        cities,
        countries
    }
}

export default useFlightsInvestigation;