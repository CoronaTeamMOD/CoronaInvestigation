import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import { alphaNumericErrorMessage, max50LengthErrorMessage } from 'commons/Schema/messages';

import TypePreventiveTextField from './TypingPreventionTextField';
import AlphanumericTextFieldType from './AlphanumericTextFieldTypes';

export const stringAlphanum = yup
  .string()
  .matches(ALPHANUMERIC_TEXT_REGEX, alphaNumericErrorMessage)
  .max(50, max50LengthErrorMessage);

const AlphanumericTextField: AlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        error={props.error ?? ''}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default AlphanumericTextField;