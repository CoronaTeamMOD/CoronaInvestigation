import District from 'models/District';

export const SET_DISTRICTS = 'SET_DISTRICTS';

interface SetCounties {
    type: typeof SET_DISTRICTS,
    payload: { districts: District[] }
};

export type districtAction = SetCounties;