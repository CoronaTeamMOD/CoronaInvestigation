import * as Actions from './greenPassActionTypes';
import GreenPassAnswer from 'models/GreenPassAnswer';
import GreenPassQuestion from 'models/GreenPassQuestion';

export interface GreenPassReducerType {
    greenPassQuestions : GreenPassQuestion[],
    greenPassAnswers : GreenPassAnswer[]
};

const initialState : GreenPassReducerType= {
    greenPassQuestions: [],
    greenPassAnswers: []
};

const greenPassReducer = (state = initialState, action: Actions.greenPassAction) : GreenPassReducerType => {
    switch (action.type) {
        case Actions.SET_GREEN_PASS_QUESTIONS: {
            return {...state, greenPassQuestions: action.payload.greenPassQuestions}
        };
        case Actions.SET_GREEN_PASS_ANSWERS: {
            return {...state, greenPassAnswers: action.payload.greenPassAnswers}
        };
        default:  return state;
    }
};

export default greenPassReducer;