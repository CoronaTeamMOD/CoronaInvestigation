import User from 'models/User';
import UserType from 'models/UserType';

export const SET_USER = 'SET_USER';
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
export const SET_INVESTIGATION_GROUP = 'SET_INVESTIGATION_GROUP';
export const SET_USER_TYPES = 'SET_USER_TYPES';
export const SET_DISPLAYED_COUNTY = 'SET_DISPLAYED_COUNTY';
export const SET_DISPLAYED_DISTRICT = 'SET_DISPLAYED_DISTRICT';
export const SET_DISPLAYED_USER_TYPE = 'SET_DISPLAYED_USER_TYPE';

interface SetUser {
    type: typeof SET_USER,
    payload: { user: User }
};

interface SetIsActive {
    type: typeof SET_IS_ACTIVE,
    payload: { isActive: boolean }
};

interface SetInvestigationGroup {
    type: typeof SET_INVESTIGATION_GROUP,
    payload: { districtId: number, countyDisplayName: string }
};

interface SetDisplayedCounty {
    type: typeof SET_DISPLAYED_COUNTY,
    payload: { county: number }
};

interface SetDisplayedDistrict {
    type: typeof SET_DISPLAYED_DISTRICT,
    payload: { district: number }
};

interface SetUserTypes {
    type: typeof SET_USER_TYPES,
    payload: { userTypes: UserType[] }
};

interface SetDisplayedUserType {
    type: typeof SET_DISPLAYED_USER_TYPE,
    payload: { userType: number }
};

export type UserAction = SetUser | SetIsActive | SetInvestigationGroup | SetDisplayedCounty | SetDisplayedDistrict | SetUserTypes | SetDisplayedUserType;