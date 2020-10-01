import React from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import * as yup from 'yup';

import get from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/);

const errMessage = "השדה יכול להכיל רק אותיות ומספרים";

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  const value =  (props.value == null || props.value === undefined) ? "" : props.value;
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
    helperText
  } = props;



  return (
    <Tooltip open={get(errors, name)} title={get(errors, name)? errMessage : ""}>
      <TextField
        helperText={helperText}
        test-id={testId}
        required={required}
        name={name}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          const isValid = stringAlphanum.isValidSync(newValue);
          if (isValid || newValue === "") {
            clearErrors(name);
            onChange(newValue);
          } else {
            setError(name, {
              type: "manual",
              message: errMessage,
            });
          }
        }}
        onBlur={onBlur}
        error={get(errors, name)}
        label={get(errors, name) ? get(errors, name).message : label}
        placeholder={placeholder}
        className={className}
      />
    </Tooltip>
  );
};

export default AlphanumericTextField;