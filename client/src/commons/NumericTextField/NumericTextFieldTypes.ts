import React from 'react';
import { DeepMap, FieldError } from 'react-hook-form';

export interface NumericTextFieldProps<T> {
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    required?: boolean,
    label?: string,
    setError: (name: string, error: { type?: string, types?: object, message?: string, shouldFocus?: boolean }) => void,
    clearErrors: (name?: string | string[]) => void,
    errors: Record<string, Object> | DeepMap<object, FieldError>,
    placeholder?: string,
    className?: string,
    testId?: string,
    error? : boolean,
}

type NumericTextFieldType = <T>(props: NumericTextFieldProps<T>) => JSX.Element;
export default NumericTextFieldType;