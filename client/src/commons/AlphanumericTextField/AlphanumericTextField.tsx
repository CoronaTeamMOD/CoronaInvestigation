import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import { max50LengthErrorMessage, alphaNumericErrorMessage } from 'commons/Schema/messages';

import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

export const stringAlphanum = yup
  .string()
  .matches(ALPHANUMERIC_TEXT_REGEX, alphaNumericErrorMessage)
  .max(50, max50LengthErrorMessage);

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