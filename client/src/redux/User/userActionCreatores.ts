import * as actionTypes from './userActionTypes';
import {store} from '../store';
import User from 'models/User';

export const setUser = (user: User): void => {
    store.dispatch({
        type: actionTypes.SET_USER,
        payload: {user}
    })
}