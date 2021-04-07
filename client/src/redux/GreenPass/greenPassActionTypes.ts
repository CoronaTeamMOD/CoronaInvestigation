import GreenPassAnswer from 'models/GreenPassAnswer';
import GreenPassQuestion from 'models/GreenPassQuestion';

export const SET_GREEN_PASS_QUESTIONS = 'SET_GREEN_PASS_QUESTIONS';
export const SET_GREEN_PASS_ANSWERS = 'SET_GREEN_PASS_ANSWERS';

interface setGreenPassQuestions {
    type: typeof SET_GREEN_PASS_QUESTIONS;
    payload: { greenPassQuestions: GreenPassQuestion[]};
};

interface setGreenPassAnswers {
    type: typeof SET_GREEN_PASS_ANSWERS;
    payload: { greenPassAnswers: GreenPassAnswer[]};
};

export type greenPassAction = setGreenPassQuestions | setGreenPassAnswers;