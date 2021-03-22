import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX } from 'commons/Regex/Regex';
import { max100LengthErrorMessage, alphaNumericWhiteSpaceErrorMessage } from 'commons/Schema/messages';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX, alphaNumericWhiteSpaceErrorMessage)
  .max(50, max100LengthErrorMessage);

const ExposureSearchTextField: AlphbetTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphabet}
    />
  );
};

export default ExposureSearchTextField;