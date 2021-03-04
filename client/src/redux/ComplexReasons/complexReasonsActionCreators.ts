import { store } from '../store';
import * as actionTypes from './complexReasonsActionTypes';

export const setComplexReasons = (complexReasons: (number|null)[]): void => {
    store.dispatch({
        type: actionTypes.SET_COMPLEX_REASONS,
        payload: { complexReasons }
    })
}