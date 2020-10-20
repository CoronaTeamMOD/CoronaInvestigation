import User from 'models/User';

export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';

interface SetUser {
    type: typeof SET_USER,
    payload: { user: User }
}
interface SetToken {
    type: typeof SET_TOKEN,
    payload: string
}

export type UserAction = SetUser | SetToken;