import User from 'models/User';

import {store} from '../store';
import * as actionTypes from './userActionTypes';

export const setUser = (user: User): void => {
    store.dispatch({
        type: actionTypes.SET_USER,
        payload: {user}
    })
}

export const setIsActive = (isActive: boolean) => {
    store.dispatch({
        type: actionTypes.SET_IS_ACTIVE,
        payload: {isActive}
    });
}
