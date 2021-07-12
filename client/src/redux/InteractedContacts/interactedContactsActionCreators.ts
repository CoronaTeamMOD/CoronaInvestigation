import * as actionTypes from './interactedContactsActionTypes';
import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FormStateObject, InteractedContactsState } from './interactedContactsReducer';
import InteractedContact from '../../models/InteractedContact';
import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import { FormState } from 'react-hook-form';
import ContactQuestioningSchema from 'components/App/Content/InvestigationForm/TabManagement/ContactQuestioning/ContactSection/Schemas/ContactQuestioningSchema';
import { getAllInteractedContacts } from '../../httpClient/InteractedContacts/interactedContacts';
import { store } from 'redux/store';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

export const getInteractedContacts = (minimalDate?: Date): ThunkAction<void, InteractedContactsState, unknown, actionTypes.InteractedContactAction> => async dispatch => {
    dispatch({
        type: actionTypes.GET_INTERACTED_CONTACTS_PENDING
    });

    try {
        const contacts = await getAllInteractedContacts(minimalDate);
        let map = new Map();
        contacts.forEach(contact => {
            ContactQuestioningSchema.isValid(contact).then(valid => {
                map.set(contact.id, new FormStateObject(valid))
            })
        });
        dispatch({
            type: actionTypes.GET_INTERACTED_CONTACTS_SUCCESS,
            payload: {
                interactedContacts: contacts,
                formState: map
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

export const setInteractedContact = (contact: InteractedContact, formState: FormState<GroupedInteractedContact>) => {
    const formStateFromStore = useSelector<StoreStateType, Map<number, FormStateObject>>(state => state.interactedContacts.formState);
    store.dispatch({
        type: actionTypes.SET_INTERACTED_CONTACT_FORM_STATE,
        payload: { formState: formStateFromStore.set(contact.id, new FormStateObject(formState.isValid)) }
    });
}

// export const setInteractedContact = (contact: GroupedInteractedContact, formState: FormState<GroupedInteractedContact>):
//     ThunkAction<void, InteractedContactsState, unknown, actionTypes.InteractedContactAction> => async (dispatch, getState) => {
//         dispatch({
//             type: actionTypes.SET_INTERACTED_CONTACT_PENDING
//         });

//         const contacts = [contact];
//         const data = {
//             unSavedContacts: {
//                 contacts
//             },
//         };
//         axios.post('/contactedPeople/interactedContacts', data)
//             .then(res => {
//                 dispatch({
//                     type: actionTypes.SET_INTERACTED_CONTACT_SUCCESS,
//                     payload: {
//                         interactedContact: res.data,
//                         formState: getState().formState.set(contact.id, new FormStateObject(formState.isValid))
//                     }
//                 });
//             })
//             .catch(err => {
//                 dispatch({
//                     type: actionTypes.SET_INTERACTED_CONTACT_ERROR,
//                     error: err
//                 });
//             });
//     }

export const updateInteractedContacts = (contacts: InteractedContact[]):
    ThunkAction<void, InteractedContactsState, unknown, actionTypes.InteractedContactAction> => async dispatch => {
        dispatch({
            type: actionTypes.SET_INTERACTED_CONTACTS_PENDING
        });

        const data = {
            unSavedContacts: {
                contacts
            },
        };

        axios.post('/contactedPeople/interactedContacts', data)
            .then(res => {
                dispatch({
                    type: actionTypes.SET_INTERACTED_CONTACTS_SUCCESS,
                    payload: { interactedContacts: res.data }
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.SET_INTERACTED_CONTACTS_ERROR,
                    error: err
                });
            });
    }
