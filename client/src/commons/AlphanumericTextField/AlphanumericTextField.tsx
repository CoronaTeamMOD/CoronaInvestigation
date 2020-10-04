import React from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import * as yup from 'yup';

import get from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/);

const errorMessage = 'השדה יכול להכיל רק אותיות ומספרים';

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  const value = (props.value == null || props.value === undefined) ? "" : props.value;
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
  } = props;

  const conditionalyTriggerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isValid = stringAlphanum.isValidSync(newValue);
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
    <Tooltip open={errorObject? true : false} title={errorObject ? errorMessage : ""}>
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
    </Tooltip>
  );
};

export default AlphanumericTextField;