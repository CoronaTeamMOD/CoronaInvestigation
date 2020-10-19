import User from 'models/User';

import {store} from '../store';
import * as actionTypes from './userActionTypes';

export const setUser = (user: User): void => {
    store.dispatch({
        type: actionTypes.SET_USER,
        payload: {user}
    })
}

export const setToken = (token: string): void => {
    store.dispatch({
        type: actionTypes.SET_TOKEN,
        payload: token
    })
}