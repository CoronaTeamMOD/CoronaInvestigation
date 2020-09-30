import User from 'models/User';

export const SET_GROUP_USERS = 'SET_GROUP_USERS';

interface SetGroupUsers {
    type: typeof SET_GROUP_USERS,
    payload: {groupUsers : Map<string, User>}
}

export type groupUsersAction = SetGroupUsers;