import React from 'react';
import { TextFieldProps } from '@material-ui/core';

export interface AlphanumericTextSpecialCharsFieldProps<T> {
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
    fullWidth?: boolean,
    maxLength?: number
}

type AlphanumericTextSpecialCharsFieldType = <T>(props: AlphanumericTextSpecialCharsFieldProps<T>) => JSX.Element;

export default AlphanumericTextSpecialCharsFieldType;