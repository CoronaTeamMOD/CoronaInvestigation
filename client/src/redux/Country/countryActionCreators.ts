import Country from 'models/Country';

import {store} from '../store';
import * as actionTypes from './countryActionTypes';

export const setCountries = (countries: Map<string, Country>): void => {
    store.dispatch({
        type: actionTypes.SET_COUNTRIES,
        payload: {countries}
    })
}