import {store} from '../store';
import * as actionTypes from './formActionTypes';

export const setFormState = (id : number, isValid: boolean): void => {
    store.dispatch({
        type: actionTypes.SET_FORM_STATE,
        payload: {id,isValid}
    })
}