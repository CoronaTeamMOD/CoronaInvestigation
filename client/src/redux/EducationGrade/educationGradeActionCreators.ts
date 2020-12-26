import EducationGrade from 'models/EducationGrade';

import {store} from '../store';
import * as actionTypes from './educationGradeActionTypes';

export const setEducationGrade = (educationGrades: EducationGrade[]): void => {
    store.dispatch({
        type: actionTypes.SET_EDUCATION_GRADES,
        payload: {educationGrades}
    })
}
