import County from 'models/County';

export const SET_COUNTIES = 'SET_COUNTIES';

interface SetCounties {
    type: typeof SET_COUNTIES,
    payload: { counties: County[], userDistrict: number }
};

export type countyAction = SetCounties;