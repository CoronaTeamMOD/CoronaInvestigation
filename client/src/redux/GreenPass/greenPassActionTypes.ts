import GreenPassQuestion from 'models/GreenPassQuestion';

export const SET_GREEN_PASS_QUESTIONS = 'SET_GREEN_PASS_QUESTIONS';

interface setGreenPassQuestions {
    type: typeof SET_GREEN_PASS_QUESTIONS;
    payload: { greenPassQuestions: GreenPassQuestion[]};
}

export type greenPassAction = setGreenPassQuestions;