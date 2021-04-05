import React from 'react';
import * as yup from 'yup';

import { ALPHBET_DASH_TEXT_REGEX } from 'commons/Regex/Regex';
import { max50LengthErrorMessage, alphbetDashErrorMessage } from 'commons/Schema/messages';

import AlphbetWithDashTextFieldType from './AlphabetWithDashTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabetWithDash = yup
  .string()
  .matches(ALPHBET_DASH_TEXT_REGEX, alphbetDashErrorMessage)
  .max(50, max50LengthErrorMessage);

const AlphabetWithDashTextField: AlphbetWithDashTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphabetWithDash}
    />
  );
};

export default AlphabetWithDashTextField;