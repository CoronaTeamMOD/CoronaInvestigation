import * as actionTypes from './interactedContactsActionTypes';
import { ThunkAction } from 'redux-thunk';
import { FormStateObject, InteractedContactsState } from './interactedContactsReducer';
import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import { getAllInteractedContacts } from '../../httpClient/interactedContacts';
import StoreStateType from 'redux/storeStateType';

export const getInteractedContacts = (minimalDate?: Date): ThunkAction<void, InteractedContactsState, unknown, actionTypes.InteractedContactAction> => async dispatch => {
    dispatch({
        type: actionTypes.GET_INTERACTED_CONTACTS_PENDING
    });

    try {
        const contacts = await getAllInteractedContacts(minimalDate);
        dispatch({
            type: actionTypes.GET_INTERACTED_CONTACTS_SUCCESS,
            payload: {
                interactedContacts: contacts
            }
        });
    }
    catch (err) {
        dispatch({
            type: actionTypes.GET_INTERACTED_CONTACTS_ERROR,
            error: err
        });
    }
}

type ValueOf<T> = T[keyof T];

export const setInteractedContact =
    (id: number, propertyName: keyof GroupedInteractedContact, value: ValueOf<GroupedInteractedContact>):
        ThunkAction<void, StoreStateType, unknown, actionTypes.InteractedContactAction> => (dispatch, getState) => {
            dispatch({
                type: actionTypes.SET_INTERACTED_CONTACT,
                payload: { id, propertyName, value }
            })
        }

export const setContactFormState =
    (id: number, isValid: boolean):
        ThunkAction<void, StoreStateType, unknown, actionTypes.InteractedContactAction> => (dispatch, getState) => {
            dispatch({
                type: actionTypes.SET_CONTACT_FORM_STATE,
                payload: { id, isValid }
            })
        }

export const resetInteractedContacts = () => {
    return {
        type: actionTypes.RESET_INTERACTED_CONTACTS
    };
}