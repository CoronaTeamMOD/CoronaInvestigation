import County from 'models/County';

import { store } from '../store';
import * as actionTypes from './countyActionTypes';

export const setCounties = (counties: County[], userDistrict: number): void => {
    store.dispatch({
        type: actionTypes.SET_COUNTIES,
        payload: {counties, userDistrict}
    });
};