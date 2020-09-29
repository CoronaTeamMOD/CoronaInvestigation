import React from "react";
import { TextField, Tooltip } from "@material-ui/core";
import AlphanumericTextFieldType from "./AlphanumericTextFieldTypes";
import * as yup from "yup";

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/);

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  const value =  (props.value == null || props.value === undefined) ? "" : props.value;
  const {
    name,
    onChange,
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
    <Tooltip open={errors.hasOwnProperty(name)} title={errors[name]?.message}>
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
              message: "השדה יכול להכיל רק אותיות ומספרים",
            });
          }
        }}
        onBlur={() => {
            clearErrors(name);
        } }
        label={label}
        placeholder={placeholder}
        className={className}
      />
    </Tooltip>
  );
};

export default AlphanumericTextField;
