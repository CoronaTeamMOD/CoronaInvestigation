import React from 'react';

export interface IdentificationNumberTextFieldProps<T> {
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    error? : boolean,
    className?: string,
    disabled?: boolean,
}

type IdentificationNumberTextFieldType = <T>(props: IdentificationNumberTextFieldProps<T>) => JSX.Element;

export default IdentificationNumberTextFieldType;
