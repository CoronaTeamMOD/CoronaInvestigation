import React from 'react';

export interface NumericTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    error? : boolean,
    placeholder?: string,
    label?: string,
    className?: string,
    variant? : string,
    InputProps? :any,
    fullWidth? : boolean,
    onKeyDown?: any 
}

type NumericTextFieldType = <T>(props: NumericTextFieldProps<T>) => JSX.Element;

export default NumericTextFieldType;
