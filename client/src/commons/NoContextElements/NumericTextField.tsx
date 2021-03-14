import React from 'react';
import * as yup from 'yup';

import { NUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';

import NumericTextFieldType from './NumericTextFieldTypes';
import TypePreventiveTextField from './TypingPreventionTextField';

const maxLengthErrorMessage = 'השדה יכול להכיל 10 מספרים בלבד';
const alphabeticErrorMessage = 'השדה יכול להכיל מספרים בלבד';

const stringAlphabet = yup.string().matches(NUMERIC_TEXT_REGEX, alphabeticErrorMessage).max(10, maxLengthErrorMessage);

const NumericTextField: NumericTextFieldType = (props) => {

  const { value, error } = props;

  return (
    <TypePreventiveTextField
      {...props}
      error={error ?? ''}
      value={value || ''}
      validationSchema={stringAlphabet}
    />
  );
};

export default NumericTextField;
