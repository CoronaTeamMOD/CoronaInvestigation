import React from 'react';

export interface HebrewTextFieldProps<T> {
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    error? : string,
    className?: string,
    disabled?: boolean,
}

type HebrewTextFieldType = <T>(props: HebrewTextFieldProps<T>) => JSX.Element;

export default HebrewTextFieldType;
