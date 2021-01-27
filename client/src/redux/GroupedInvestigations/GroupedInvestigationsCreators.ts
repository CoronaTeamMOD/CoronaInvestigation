import {store} from '../store';
import * as actionTypes from './GroupedInvestigationsActionTypes';

import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

export const setGroupId = (groupId: string): void => {
    store.dispatch({
        type: actionTypes.SET_GROUP_ID,
        payload: {groupId}
    })
}

export const setGroupedInvestigations = (investigations: ConnectedInvestigationContact): void => {
    store.dispatch({
        type: actionTypes.SET_GROUPED_INVESTIGATIONS,
        payload: {investigations}
    })
}