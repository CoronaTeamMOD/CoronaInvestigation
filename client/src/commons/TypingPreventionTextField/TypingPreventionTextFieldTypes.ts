import React from 'react';
import * as yup from 'yup';

export interface TypePreventiveTextFieldProps<T> {
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    validationSchema: yup.StringSchema<string | undefined, object>
    placeholder?: string,
    label?: string,
    className?: string,
}

type TypePreventiveTextFieldType = <T>(props: TypePreventiveTextFieldProps<T>) => JSX.Element;
export default TypePreventiveTextFieldType;