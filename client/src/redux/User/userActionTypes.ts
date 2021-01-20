import User from 'models/User';

export const SET_USER = 'SET_USER';
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
export const SET_DISPLAYED_COUNTY = 'SET_DISPLAYED_COUNTY';
interface SetUser {
    type: typeof SET_USER,
    payload: { user: User }
}

interface SetIsActive {
    type: typeof SET_IS_ACTIVE,
    payload: { isActive: boolean }
};

interface SetDisplayedCounty {
    type: typeof SET_DISPLAYED_COUNTY,
    payload: { county: number }
};

export type UserAction = SetUser | SetIsActive | SetDisplayedCounty;