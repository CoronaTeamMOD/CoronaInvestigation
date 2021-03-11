import District from 'models/District';

import { store } from '../store';
import * as actionTypes from './districtActionTypes';

export const setDistricts = (districts: District[]): void => {
    store.dispatch({
        type: actionTypes.SET_DISTRICTS,
        payload: {districts}
    });
};