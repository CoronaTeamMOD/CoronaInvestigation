import FlattenedDBAddress from 'models/DBAddress';

import {store} from '../store';
import * as actionTypes from './AddressActionTypes';

export const setAddress = (address: FlattenedDBAddress): void => {
    store.dispatch({
        type: actionTypes.SET_ADDRESS,
        payload: {address}
    })
}
