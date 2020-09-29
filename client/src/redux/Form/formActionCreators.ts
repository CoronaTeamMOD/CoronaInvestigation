
import {store} from '../store';
import * as actionTypes from './formActionTypes';

export const setFormState = (investigationId : number, tabId : number, isValid: boolean): void => {
    store.dispatch({
        type: actionTypes.SET_FORM_STATE,
        payload: {investigationId, tabId, isValid}
    })
}  