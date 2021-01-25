import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX } from 'commons/Regex/Regex';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות, מספרים, מקף ורווח';
const maxLengthErrorMessage = 'השדה יכול להכיל 100 תווים בלבד';

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX, errorMessage)
  .max(50, maxLengthErrorMessage);

const ExposureSearchTextField: AlphbetTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphabet}
    />
  );
};

export default ExposureSearchTextField;