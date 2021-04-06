import GreenPassQuestion from 'models/GreenPassQuestion';

import {store} from '../store';
import * as actionTypes from './greenPassActionTypes';

export const setGreenPassQuestions = (greenPassQuestions: GreenPassQuestion[]): void => {
    store.dispatch({
        type: actionTypes.SET_GREEN_PASS_QUESTIONS,
        payload: {greenPassQuestions}
    })
};