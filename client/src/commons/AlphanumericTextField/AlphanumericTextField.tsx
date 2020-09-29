import React from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import * as yup from 'yup';
import _ from 'lodash'

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
    error,
    helperText
  } = props;

  return (
    <Tooltip open={_.get(errors, name)} title={_.get(errors, name)? errMessage : ""}>
      <TextField
        helperText={helperText}
        error={error}
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
        error={_.get(errors, name)}
        label={_.get(errors, name) ? _.get(errors, name).message : label}
        placeholder={placeholder}
        className={className}
      />
    </Tooltip>
  );
};

export default AlphanumericTextField;