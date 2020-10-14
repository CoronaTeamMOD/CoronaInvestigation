import React from 'react';
import * as yup from 'yup';

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות ומספרים';

const stringAlphanum = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/, errorMessage)
  .max(50);


const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphanum}
    />
  );
};

export default AlphanumericTextField;
