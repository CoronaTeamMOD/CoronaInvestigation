import ContactType from 'models/ContactType';

import {store} from '../store';
import * as actionTypes from './contactTypeActionTypes';

export const setContactType = (contactTypes: Map<number, ContactType>): void => {
    store.dispatch({
        type: actionTypes.SET_CONTACT_TYPES,
        payload: {contactTypes}
    })
}