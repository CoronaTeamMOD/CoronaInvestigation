import User from 'models/User';

export const SET_USER = 'SET_USER';
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE';

interface SetUser {
    type: typeof SET_USER,
    payload: { user: User }
}

interface SetIsActive {
    type: typeof SET_IS_ACTIVE,
    payload: { isActive: boolean }
};

export type UserAction = SetUser | SetIsActive;