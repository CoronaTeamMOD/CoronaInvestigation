import {store} from '../store';
import * as actionTypes from './subStatusesActionTypes';

export const setSubStatuses = (subStatuses: string[]): void => {
    store.dispatch({
        type: actionTypes.SET_SUB_STATUSES,
        payload: {subStatuses}
    })
}