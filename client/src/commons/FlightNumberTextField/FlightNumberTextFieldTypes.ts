import React from 'react';

export interface FlightNumberTextFieldProps<T> {
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

type FlightNumberTextFieldType = <T>(props: FlightNumberTextFieldProps<T>) => JSX.Element;

export default FlightNumberTextFieldType;
