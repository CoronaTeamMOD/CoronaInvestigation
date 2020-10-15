import DBAddress from 'models/DBAddress';

import {store} from '../store';
import * as actionTypes from './AddressActionTypes';

export const setAddress = (address: DBAddress): void => {
    store.dispatch({
        type: actionTypes.SET_ADDRESS,
        payload: {address}
    })
}
