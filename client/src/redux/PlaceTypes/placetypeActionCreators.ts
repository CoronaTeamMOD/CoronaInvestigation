import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

import {store} from '../store';
import * as actionTypes from './placetypeActionTypes';

export const setPlaceTypes = (placeSubTypesByTypes: PlacesSubTypesByTypes): void => {
    store.dispatch({
        type: actionTypes.SET_PLACE_TYPES,
        payload: {placeSubTypesByTypes}
    })
};