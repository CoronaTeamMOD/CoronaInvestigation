import StoreStateType from '../storeStateType';
import {greenPassAction, SET_GREEN_PASS_QUESTIONS} from './greenPassActionTypes';

const initialState: StoreStateType['greenPassQuestions']= [];

const greenPassReducer = (state = initialState, action: greenPassAction) :  StoreStateType['greenPassQuestions'] => {
    switch (action.type) {
        case SET_GREEN_PASS_QUESTIONS: {
            return action.payload.greenPassQuestions
        }
        default:  return state;
    }
};

export default greenPassReducer;