export const SET_OCCUPATIONS = 'SET_OCCUPATIONS';

interface SetOccupations {
    type: typeof SET_OCCUPATIONS;
    payload: { occupations: string[] };
}

export type occupationsAction = SetOccupations;
