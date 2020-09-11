import City from 'models/City';

import {store} from '../store';
import * as actionTypes from './cityActionTypes';

export const setCities = (cities: Map<string, City>): void => {
    store.dispatch({
        type: actionTypes.SET_CITIES,
        payload: {cities}
    })
}