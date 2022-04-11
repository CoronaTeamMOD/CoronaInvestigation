import Airline from 'models/Airline';

import {store} from '../store';
import * as actionTypes from './airlineActionTypes';

export const setAirlines = (airlines: Map<string, string>): void => {
    store.dispatch({
        type: actionTypes.SET_AIRLINES,
        payload: {airlines}
    })
}