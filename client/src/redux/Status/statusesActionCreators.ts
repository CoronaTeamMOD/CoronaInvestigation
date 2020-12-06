import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { store } from '../store';
import * as actionTypes from './statusesActionTypes';

export const setStatuses = (statuses: InvestigationMainStatus[]): void => {
    store.dispatch({
        type: actionTypes.SET_STATUSES,
        payload: { statuses }
    })
}