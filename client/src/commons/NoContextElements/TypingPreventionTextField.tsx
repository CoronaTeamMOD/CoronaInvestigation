import React, { useMemo } from 'react';
import { TextField } from '@material-ui/core';

import TypePreventiveTextFieldType from './TypingPreventionTextFieldTypes';

const TypePreventiveTextField: TypePreventiveTextFieldType = (props) => {
    
    const { error, testId, name, onChange, validationSchema, label, disabled, ...textFieldProps } = props;

    const value = props.value ?? '';
    
    const conditionalyTriggerOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        try {
            validationSchema.validateSync(newValue);
            onChange(newValue);
        } catch (error) {

        }
    };

    const getTextField = useMemo(() => {
        return (
            <TextField
                test-id={testId}
                name={name}
                value={value}
                onChange={conditionalyTriggerOnChange}
                error={Boolean(error)}
                label={error || label}
                disabled={disabled}
                {...textFieldProps}
            />
        )
    } , [value, name, error, disabled])
    return (
        getTextField
    );
};

export default TypePreventiveTextField;