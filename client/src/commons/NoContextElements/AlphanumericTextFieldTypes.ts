import React from 'react';
import { TextFieldProps } from '@material-ui/core';

export interface AlphanumericTextFieldProps<T> {
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
    InputProps?: TextFieldProps['InputProps'];
}

type AlphanumericTextFieldType = <T>(props: AlphanumericTextFieldProps<T>) => JSX.Element;

export default AlphanumericTextFieldType;
