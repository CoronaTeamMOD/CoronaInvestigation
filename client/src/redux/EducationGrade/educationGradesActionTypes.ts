import EducationGrade from 'models/EducationGrade';

export const SET_EDUCATION_GRADES = 'SET_EDUCATION_GRADES';

interface SetEducationGradesState {
    type: typeof SET_EDUCATION_GRADES,
    payload: { educationGrade: Map<number, EducationGrade> }
}

export type educationGradesAction = SetEducationGradesState;
