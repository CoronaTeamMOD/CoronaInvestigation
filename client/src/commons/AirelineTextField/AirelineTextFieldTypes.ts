import React from 'react';

export interface AirelineTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
}

type AirelineTextFieldType = <T>(props: AirelineTextFieldProps<T>) => JSX.Element;
export default AirelineTextFieldType;