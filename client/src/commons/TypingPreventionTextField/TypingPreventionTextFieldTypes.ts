import React from 'react';
import * as yup from 'yup';
import {TextFieldProps} from '@material-ui/core';

export interface TypePreventiveTextFieldProps<T> {
    disabled?: boolean,
    testId?: string,
    name: string,
    value: T | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    validationSchema: yup.StringSchema<string | undefined, object>
    placeholder?: string,
    label?: string,
    className?: string,
    multiline?: TextFieldProps['multiline'];
    fullWidth?: TextFieldProps['fullWidth'];
    inputProps?: TextFieldProps['inputProps']
}

type TypePreventiveTextFieldType = <T>(props: TypePreventiveTextFieldProps<T>) => JSX.Element;
export default TypePreventiveTextFieldType;