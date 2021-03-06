import React from 'react';

export interface InternationalCityTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
    fullwidth?: boolean,
}

type InternationalCityTextFieldType = <T>(props: InternationalCityTextFieldProps<T>) => JSX.Element;
export default InternationalCityTextFieldType;