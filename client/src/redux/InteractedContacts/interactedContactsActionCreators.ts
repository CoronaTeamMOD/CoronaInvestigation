import * as actionTypes from './interactedContactsActionTypes';
import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FormStateObject, InteractedContactsState } from './interactedContactsReducer';
import InteractedContact from '../../models/InteractedContact';
import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import { FormState } from 'react-hook-form';
import ContactQuestioningSchema from 'components/App/Content/InvestigationForm/TabManagement/ContactQuestioning/ContactSection/Schemas/ContactQuestioningSchema';
import { getAllInteractedContacts } from '../../httpClient/InteractedContacts/interactedContacts';
import StoreStateType from 'redux/storeStateType';

export const getInteractedContacts = (minimalDate?: Date): ThunkAction<void, InteractedContactsState, unknown, actionTypes.InteractedContactAction> => async dispatch => {
    dispatch({
        type: actionTypes.GET_INTERACTED_CONTACTS_PENDING
    });

    try {
        const contacts = await getAllInteractedContacts(minimalDate);
        let map = [];
        for (let i = 0; i < contacts.length; i++) {
            const valid = await ContactQuestioningSchema.isValid({ ...contacts[i], identificationType: contacts[i]?.identificationType?.id });
            map.push(new FormStateObject(contacts[i].id, valid));
        }
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

type ValueOf<T> = T[keyof T];

export const setInteractedContact =
    (id: number, propertyName: keyof GroupedInteractedContact, value: ValueOf<GroupedInteractedContact>, formState: FormState<GroupedInteractedContact>):
        ThunkAction<void, StoreStateType, unknown, actionTypes.InteractedContactAction> => (dispatch, getState) => {
            dispatch({
                type: actionTypes.SET_INTERACTED_CONTACTS_FORM_STATE,
                payload: {
                    interactedContacts: getState().interactedContacts.interactedContacts.filter(x => x.id == id).map(contact => {
                        (contact[propertyName] as ValueOf<GroupedInteractedContact>) = value;
                        return contact;
                    }),
                    formState: getState().interactedContacts.formState.filter(x => x.id == id).map(state => {
                        state.isValid = Object.keys(formState.errors).length === 0;
                        return state;
                      }),
                }
            });
        }

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