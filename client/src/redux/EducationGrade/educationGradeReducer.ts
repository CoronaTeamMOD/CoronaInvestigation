import EducationGrade from 'models/EducationGrade';

import * as Actions from './educationGradesActionTypes';

const initialState: Map<number, EducationGrade> = new Map();

const formReducer = (state = initialState, action: Actions.educationGradesAction): Map<number, EducationGrade> => {
    switch (action.type) {
        case Actions.SET_EDUCATION_GRADES: {
            return action.payload.educationGrade
        }
        default:  return state;
    }
}

export default formReducer;
