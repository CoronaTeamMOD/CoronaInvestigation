import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

export const SET_PLACE_TYPES = 'SET_PLACE_TYPES';

interface SetPlaceTypes {
    type: typeof SET_PLACE_TYPES;
    payload: { placeSubTypesByTypes: PlacesSubTypesByTypes};
}

export type placeTypesAction = SetPlaceTypes;
