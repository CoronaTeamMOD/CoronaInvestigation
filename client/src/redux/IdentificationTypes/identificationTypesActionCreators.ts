import IdentificationType from 'models/IdentificationType';

import { store } from '../store';
import * as actionTypes from './identificationTypesActionTypes';

export const setIdentificationTypes = (identificationTypes: IdentificationType[]): void => {
    store.dispatch({
        type: actionTypes.SET_IDENTIFICATION_TYPES,
        payload: {identificationTypes}
    });
};