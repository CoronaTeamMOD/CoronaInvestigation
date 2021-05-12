import React from 'react';

export interface NumericTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    error? : string,
    placeholder?: string,
    label?: string,
    className?: string,
    onKeyDown?: (e: any) => void,
    fullWidth?: boolean  
}

type NumericTextFieldType = <T>(props: NumericTextFieldProps<T>) => JSX.Element;

export default NumericTextFieldType;