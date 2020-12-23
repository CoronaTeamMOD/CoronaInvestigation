import EducationGrade from 'models/EducationGrade';
import {store} from '../store';
import * as actionTypes from './educationGradesActionTypes';

export const setEducationGrade = (educationGrades: Map<number, EducationGrade>): void => {
    store.dispatch({
        type: actionTypes.SET_EDUCATION_GRADES,
        payload: {educationGrades}
    })
}
