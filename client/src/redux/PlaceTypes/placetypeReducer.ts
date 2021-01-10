import StoreStateType from '../storeStateType';
import {placeTypesAction, SET_PLACE_TYPES} from './placetypeActionTypes';

const initialState: StoreStateType['placeSubTypesByTypes']= {};

const placetypeReducer = (state = initialState, action: placeTypesAction) :  StoreStateType['placeSubTypesByTypes'] => {
    switch (action.type) {
        case SET_PLACE_TYPES: {
            return action.payload.placeSubTypesByTypes
        }

        default:  return state;
    }
};

export default placetypeReducer;
