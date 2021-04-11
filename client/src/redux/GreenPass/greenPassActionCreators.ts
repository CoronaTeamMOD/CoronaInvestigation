import GreenPassAnswer from 'models/GreenPassAnswer';
import GreenPassQuestion from 'models/GreenPassQuestion';

import {store} from '../store';
import * as actionTypes from './greenPassActionTypes';

export const setGreenPassQuestions = (greenPassQuestions: GreenPassQuestion[]): void => {
    store.dispatch({
        type: actionTypes.SET_GREEN_PASS_QUESTIONS,
        payload: {greenPassQuestions}
    })
};

export const setGreenPassAnswers = (greenPassAnswers: GreenPassAnswer[]): void => {
    store.dispatch({
        type: actionTypes.SET_GREEN_PASS_ANSWERS,
        payload: {greenPassAnswers}
    })
};