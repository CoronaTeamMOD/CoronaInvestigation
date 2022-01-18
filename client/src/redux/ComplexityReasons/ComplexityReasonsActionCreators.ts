import ComplexityReason from 'models/ComplexityReason';
import * as actionTypes from './ComplexityReasonsActionTypes';


export const setComplexityReasons = (complexityReasons: ComplexityReason[]) => {
    return {
        type: actionTypes.SET_COMPLEXITY_REASONS,
        payload: { complexityReasons }
    };
}
