import React from 'react';
import * as yup from 'yup';

import { NUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import { max10LengthNumErrorMessage, numericErrorMessage } from 'commons/Schema/messages';

import NumericTextFieldType from './NumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabet = yup.string().matches(NUMERIC_TEXT_REGEX, numericErrorMessage).max(10, max10LengthNumErrorMessage);

const NumericTextField: NumericTextFieldType = (props) => {

  const { value, ...other } = props;

  return (
    <TypePreventiveTextField
      value={value || ''}
      validationSchema={stringAlphabet}
      {...other}
    />
  );
};

export default NumericTextField;