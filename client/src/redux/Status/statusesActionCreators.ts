import { store } from '../store';
import * as actionTypes from './statusesActionTypes';

export const setStatuses = (statuses: string[]): void => {
    store.dispatch({
        type: actionTypes.SET_STATUSES,
        payload: { statuses }
    })
}