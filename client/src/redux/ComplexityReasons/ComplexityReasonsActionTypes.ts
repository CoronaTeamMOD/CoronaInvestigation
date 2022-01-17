import ComplexityReason from 'models/ComplexityReason';

export const SET_COMPLEXITY_REASONS = 'SET_COMPLEXITY_REASONS';

interface setComplexityReasons {
    type: typeof SET_COMPLEXITY_REASONS,
    payload: { complexityReasons: ComplexityReason[] }
}

export type complexityReasonsAction = setComplexityReasons;
