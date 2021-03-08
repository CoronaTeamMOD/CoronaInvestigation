import Desk from 'models/Desk';

export const SET_DESKS = 'SET_DESKS';

interface SetDesks {
    type: typeof SET_DESKS,
    payload: { desks: Desk[] }
};

export type deskAction = SetDesks;