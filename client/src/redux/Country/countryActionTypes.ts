import Country from 'models/Country';

export const SET_COUNTRIES = 'SET_COUNTRIES';

interface SetCountries {
    type: typeof SET_COUNTRIES,
    payload: {countries : Map<string, Country>}
}

export type countryAction = SetCountries;