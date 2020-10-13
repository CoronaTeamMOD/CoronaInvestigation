import React from 'react';
import * as yup from 'yup';

import NumericTextFieldType from './NumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabet = yup
  .string()
  .required()
  .matches(/^[0-9]*$/)
  .max(50);

const errorMessage = 'השדה יכול להכיל רק מספרים';

const NumericTextField: NumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphabet}
        errorMessage={errorMessage}
    />
  );
};

export default NumericTextField;