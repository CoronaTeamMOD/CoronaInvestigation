import County from 'models/County';

import {store} from '../store';
import * as actionTypes from './deskActionTypes';

export const setDesks = (desks: County[]): void => {
    store.dispatch({
        type: actionTypes.SET_DESKS,
        payload: {desks}
    })
}