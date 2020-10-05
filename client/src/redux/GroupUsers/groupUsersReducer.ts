import User from 'models/User';

import * as Actions from './groupUsersActionTypes';

const initialState: Map<string, User> = new Map();

const groupUsersReducer = (state = initialState, action: Actions.groupUsersAction): Map<string, User> => {
    switch (action.type) {
        case Actions.SET_GROUP_USERS: {
            return action.payload.groupUsers
        }

        default: return state;
    }
}

export default groupUsersReducer;
