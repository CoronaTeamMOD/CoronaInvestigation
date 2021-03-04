export const SET_COMPLEX_REASONS = 'SET_COMPLEX_REASONS';

interface SetComplexReasons {
    type: typeof SET_COMPLEX_REASONS,
    payload: { complexReasons: (number|null)[] }
}

export type ComplexReasonsAction = SetComplexReasons;
