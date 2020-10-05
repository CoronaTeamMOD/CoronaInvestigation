import React from 'react';
import * as yup from 'yup';
import { TextField, Tooltip } from '@material-ui/core';

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import TypePreventiveTextField from '../TypePreventiveTextField/TypePreventiveTextField';

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/);

const errorMessage = 'השדה יכול להכיל רק אותיות ומספרים';

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphanum}
        errorMessage={errorMessage}
    />
  );
};

export default AlphanumericTextField;
