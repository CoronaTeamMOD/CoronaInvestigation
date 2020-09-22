import React from 'react';

export interface AlphanumericTextFieldProps<T> {
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    value?: T | null,
    name: string,
    setError: (name: string, error: { type?: string, types?: object, message?: string, shouldFocus?: boolean }) => void,
    clearErrors: (name?: string | string[]) => void
    placeholder?: string;
}

type AlphanumericTextFieldType = <T>(props: AlphanumericTextFieldProps<T>) => JSX.Element;
export default AlphanumericTextFieldType;