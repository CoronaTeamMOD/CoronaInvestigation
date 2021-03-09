import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';

import TypePreventiveTextField from './TypingPreventionTextField';
import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';

const errorMessage = 'השדה יכול להכיל רק אותיות ומספרים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';

export const stringAlphanum = yup
  .string()
  .matches(ALPHANUMERIC_TEXT_REGEX, errorMessage)
  .max(50, maxLengthErrorMessage);


const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        error={'a'}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default AlphanumericTextField;
