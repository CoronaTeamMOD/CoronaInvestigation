import City from 'models/City';

export const SET_CITIES = 'SET_CITIES';

interface SetCities {
    type: typeof SET_CITIES,
    payload: {cities : Map<string, City>}
}

export type cityAction = SetCities;