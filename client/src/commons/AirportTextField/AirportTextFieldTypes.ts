import React from 'react';

export interface AirportTextFieldProps<T> {
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

type AirportTextFieldType = <T>(props: AirportTextFieldProps<T>) => JSX.Element;
export default AirportTextFieldType;