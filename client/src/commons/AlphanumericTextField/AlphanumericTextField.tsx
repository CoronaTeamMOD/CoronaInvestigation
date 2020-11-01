import React from 'react';
import * as yup from 'yup';

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות ומספרים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';

const stringAlphanum = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default AlphanumericTextField;
