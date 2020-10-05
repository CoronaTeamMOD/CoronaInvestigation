import React from 'react';

export interface TypePreventiveTextFieldProps<T> {
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    required?: boolean,
    label?: string,
    setError: (name: string, error: { type?: string, types?: object, message?: string, shouldFocus?: boolean }) => void,
    clearErrors: (name?: string | string[]) => void,
    errors: any,
    placeholder?: string,
    className?: string,
    testId?: string,
    error? : boolean,
    errorMessage: string,
    validationSchema: any
}

type TypePreventiveTextFieldType = <T>(props: TypePreventiveTextFieldProps<T>) => JSX.Element;
export default TypePreventiveTextFieldType;