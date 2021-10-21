import * as actionTypes from './personalInfoActionTypes';
import { ThunkAction } from 'redux-thunk';
import StoreStateType from '../storeStateType';
import { PersonalInfoTabState } from 'components/App/Content/InvestigationForm/TabManagement/PersonalInfoTab/PersonalInfoTabInterfaces';
import { getPersonalInfoData } from 'httpClient/PersonalInfo/personalInfo';
import { UseFormMethods } from 'react-hook-form';

type ValueOf<T> = T[keyof T];

export const getPersonalInfo = (epidemioligyNumber: number)
    : ThunkAction<void, PersonalInfoTabState, unknown, actionTypes.PersonalInfoAction> => async dispatch => {
        try {
            const personalInfo = await getPersonalInfoData(epidemioligyNumber);
            dispatch({
                type: actionTypes.GET_PERSONAL_INFO,
                payload: { personalInfo: personalInfo }
            })
        } catch (err) {
            dispatch({
                type: actionTypes.GET_PERSONAL_INFO_ERROR,
                error: err
            });
        }
    }

export const setPersonalInfo = (propertyName: keyof PersonalInfoTabState, value: ValueOf<PersonalInfoTabState>):
    ThunkAction<void, StoreStateType, unknown, actionTypes.PersonalInfoAction> => (dispatch, getState) => {
        dispatch({
            type: actionTypes.SET_PERSONAL_INFO,
            payload: { propertyName, value }
        })
    }