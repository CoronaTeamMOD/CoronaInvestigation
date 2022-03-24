import React from 'react';
import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from '../Regex/Regex';
import { max200LengthErrorMessage, alphaNumericErrorMessage } from '../Schema/messages';

import BigAlphanumericTextFieldType from './BigAlphanumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

export const stringAlphanum = yup
  .string()
  .matches(ALPHANUMERIC_TEXT_REGEX, alphaNumericErrorMessage)
  .max(200, max200LengthErrorMessage);

const BigAlphanumericTextField: BigAlphanumericTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default BigAlphanumericTextField;