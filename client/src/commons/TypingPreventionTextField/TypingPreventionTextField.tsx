import React from 'react';
import { TextField } from '@material-ui/core';

import get from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import TypePreventiveTextFieldType from './TypingPreventionTextFieldTypes';

const TypePreventiveTextField: TypePreventiveTextFieldType = (props) => {
  const value = !props.value ? "" : props.value;
  const {
    name,
    onChange,
    onBlur,
    setError,
    clearErrors,
    errors,
    placeholder,
    className,
    label,
    required,
    testId,
    errorMessage,
    validationSchema
  } = props;

  const conditionalyTriggerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isValid = validationSchema.isValidSync(newValue);
    if (isValid || newValue === "") {
      clearErrors(name);
      onChange(newValue);
    } else {
      setError(name, {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const errorObject = get(errors, name);

  return (
      <TextField
        test-id={testId}
        required={required}
        name={name}
        value={value}
        onChange={conditionalyTriggerOnChange}
        onBlur={onBlur}
        error={errorObject ? true : false}
        label={errorObject ? errorObject.message : label}
        placeholder={placeholder}
        className={className}
      />
  );
};

export default TypePreventiveTextField;