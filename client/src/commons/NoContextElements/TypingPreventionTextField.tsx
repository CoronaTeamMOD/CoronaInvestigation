import React, { useMemo } from 'react';
import { ValidationError } from 'yup';
import { TextField } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import TypePreventiveTextFieldType from './TypingPreventionTextFieldTypes';

const TypePreventiveTextField: TypePreventiveTextFieldType = (props) => {
    const {  error, testId, name, onChange,  validationSchema,  label,...textFieldProps } = props;
    //const { errors, setError, clearErrors } = useFormContext(); 

    const value = !props.value ? '' : props.value;
    
    const conditionalyTriggerOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        try {
            validationSchema.validateSync(newValue);
            //learErrors(name);
            onChange(newValue);
        } catch (error) {
            //if (error instanceof ValidationError)
            // setError(name, {
            //     type: 'manual',
            //     message: error.message,
            // });
        }
    };

    //const errorObject = get(errors, name);

    const getTextField = useMemo(() => {
        return (
            <TextField
                test-id={testId}
                name={name}
                value={value}
                onChange={conditionalyTriggerOnChange}
                error={Boolean(error)}
                label={error || label}
                {...textFieldProps}
            />
        )

    } , [value , name , error])
    
    return (
        getTextField
    );
};

export default TypePreventiveTextField;
