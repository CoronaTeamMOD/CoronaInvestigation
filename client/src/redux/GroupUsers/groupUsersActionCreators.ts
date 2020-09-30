import User from 'models/User';

import {store} from '../store';
import * as actionTypes from './groupUsersActionTypes';

export const setGroupUsers = (groupUsers: Map<string, User>): void => {
    store.dispatch({
        type: actionTypes.SET_GROUP_USERS,
        payload: {groupUsers}
    })
}