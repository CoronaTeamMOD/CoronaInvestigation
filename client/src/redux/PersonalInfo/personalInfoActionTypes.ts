import { PersonalInfoTabState } from 'components/App/Content/InvestigationForm/TabManagement/PersonalInfoTab/PersonalInfoTabInterfaces';

export const GET_PERSONAL_INFO = 'GET_PERSONAL_INFO';
export const GET_PERSONAL_INFO_ERROR = 'GET_PERSONAL_INFO_ERROR';
export const SET_PERSONAL_INFO = 'SET_PERSONAL_INFO';
export const RESET_PERSONAL_INFO = 'RESET_PERSONAL_INFO';

type ValueOf<T> = T[keyof T];

interface GetPersonalInfo {
    type: typeof GET_PERSONAL_INFO,
    payload: {
        personalInfo: PersonalInfoTabState
    }
}

interface GetPersonalInfoError {
    type: typeof GET_PERSONAL_INFO_ERROR,
    error: any
}

interface SetPersonalInfo {
    type: typeof SET_PERSONAL_INFO,
    payload: {
        propertyName: keyof PersonalInfoTabState,
        value: ValueOf<PersonalInfoTabState>
    }
}

interface ResetPersonalInfo {
    type: typeof RESET_PERSONAL_INFO
}

export type PersonalInfoAction = GetPersonalInfo | GetPersonalInfoError | SetPersonalInfo | ResetPersonalInfo;