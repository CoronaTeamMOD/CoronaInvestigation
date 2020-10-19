import React from 'react';
import { useFormContext } from 'react-hook-form'
import { ValidationError } from "yup";
import { TextField } from '@material-ui/core';

import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import TypePreventiveTextFieldType from './TypingPreventionTextFieldTypes';

const TypePreventiveTextField: TypePreventiveTextFieldType = (props) => {
    const { testId, name, onChange, onBlur, required, validationSchema, placeholder, label, className } = props;
    const { errors, setError, clearErrors } = useFormContext(); 
    
    const value = !props.value ? "" : props.value;
    
    const conditionalyTriggerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        try {
            validationSchema.validateSync(newValue);
            clearErrors(name);
            onChange(newValue);
        } catch (error) {
            if(error instanceof ValidationError)
            setError(name, {
                type: "manual",
                message: error.message,
            });
        }
    };

    const errorObject = get(errors, name);

    return (
        <TextField
            test-id={testId}
            name={name}
            value={value}
            onChange={conditionalyTriggerOnChange}
            onBlur={onBlur}
            required={required}
            error={errorObject ? true : false}
            placeholder={placeholder}
            label={errorObject ? errorObject.message : label}
            className={className}
        />
    );
};

export default TypePreventiveTextField;