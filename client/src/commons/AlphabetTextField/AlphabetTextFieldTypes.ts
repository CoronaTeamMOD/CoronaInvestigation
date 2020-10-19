import React from 'react';

export interface AlphabetTextFieldProps<T> {
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
}

type AlphabetTextFieldType = <T>(props: AlphabetTextFieldProps<T>) => JSX.Element;
export default AlphabetTextFieldType;