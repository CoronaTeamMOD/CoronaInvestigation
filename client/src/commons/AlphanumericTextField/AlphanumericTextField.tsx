import React from 'react';
import { TextField } from '@material-ui/core';
import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import * as yup from "yup";

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/);

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
    const { onBlur, onChange, value, name, setError, clearErrors } = props;
    return (
        <TextField
            onBlur={onBlur}
            onChange={async (e) => {
                const newValue = e.target.value;
                const isValid = await stringAlphanum.isValid(newValue);
                if (isValid || newValue === "") {
                    clearErrors(name);
                    onChange(newValue);
                } else {
                    setError(name, {
                        type: "manual",
                        message: "השדה יכול להכיל רק אותיות ומספרים"
                    });
                }
            }}
            value={value}
            name={name}
        />
    );
};

export default AlphanumericTextField;