import {store} from '../store';
import * as actionTypes from './GenderActionTypes';

export const setGender = (gender: string): void => {
    store.dispatch({
        type: actionTypes.SET_GENDER,
        payload: {gender}
    })
}
