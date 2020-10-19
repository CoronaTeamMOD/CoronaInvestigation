import React from 'react';

export interface AlphanumericTextFieldProps<T> {
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    error? : boolean,
    className?: string,
}

type AlphanumericTextFieldType = <T>(props: AlphanumericTextFieldProps<T>) => JSX.Element;

export default AlphanumericTextFieldType;
