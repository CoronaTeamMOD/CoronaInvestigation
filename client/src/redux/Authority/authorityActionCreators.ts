import Authority from 'models/Authority';

import {store} from '../store';
import * as actionTypes from './authorityActionTypes';

export const setAuthorities = (authorities: Map<string, Authority>): void => {
    store.dispatch({
        type: actionTypes.SET_AUTHORITIES,
        payload: {authorities}
    })
}