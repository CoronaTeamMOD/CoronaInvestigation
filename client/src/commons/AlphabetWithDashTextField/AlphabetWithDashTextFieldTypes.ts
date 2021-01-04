import React from 'react';
import { TextFieldProps } from '@material-ui/core';

export interface AlphabetWithDashTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
    InputLabelProps?: TextFieldProps['InputLabelProps'];
}

type AlphabetWithDashTextFieldType = <T>(props: AlphabetWithDashTextFieldProps<T>) => JSX.Element;
export default AlphabetWithDashTextFieldType;