import React from 'react';
import { TextFieldProps } from '@material-ui/core';

export interface BigAlphanumericTextFieldProps<T> {
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
    InputProps?: TextFieldProps['InputProps'],
    fullWidth?: boolean
}

type BigAlphanumericTextFieldType = <T>(props: BigAlphanumericTextFieldProps<T>) => JSX.Element;

export default BigAlphanumericTextFieldType;
