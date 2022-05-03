import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_MAX_10_REGEX } from 'commons/Regex/Regex';
import { max10LengthErrorMessage, alphaNumericSpecialCharsMax10ErrorMessage } from 'commons/Schema/messages';

import AlphanumericTextSpecialCharsFieldType from './AlphanumericTextSpecialCharsFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

export const stringAlphanum = yup
  .string()
  .matches(ALPHANUMERIC_SPECIAL_CHARS_MAX_10_REGEX, alphaNumericSpecialCharsMax10ErrorMessage)
  .max(10, max10LengthErrorMessage);

const AlphanumericTextSpecialCharsField: AlphanumericTextSpecialCharsFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default AlphanumericTextSpecialCharsField;