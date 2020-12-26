import EducationGrade from 'models/EducationGrade';

import * as Actions from './educationGradeActionTypes';

const initialState: EducationGrade[] = [];

const formReducer = (state = initialState, action: Actions.educationGradesAction): EducationGrade[] => {
    switch (action.type) {
        case Actions.SET_EDUCATION_GRADES: {
            return action.payload.educationGrades
        }
        default:  return state;
    }
}

export default formReducer;
