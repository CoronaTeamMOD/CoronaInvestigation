import SubStatus from 'models/SubStatus';

import { store } from '../store';
import * as actionTypes from './subStatusesActionTypes';

export const setSubStatuses = (subStatuses: SubStatus[]): void => {
    store.dispatch({
        type: actionTypes.SET_SUB_STATUSES,
        payload: { subStatuses }
    })
};