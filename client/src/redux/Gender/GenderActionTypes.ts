export const SET_GENDER = 'SET_GENDER';

interface SetGender {
    type: typeof SET_GENDER,
    payload: { gender: string }
}

export type GenderAction = SetGender;
