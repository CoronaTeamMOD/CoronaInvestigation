import React from 'react';
import * as yup from 'yup';

import { HEBREW_TEXT_REGEX } from 'commons/Regex/Regex';
import { hebrewTextErrorMessage, max50LengthErrorMessage } from 'commons/Schema/messages';

import HebrewTextFieldType from './HebrewTextFieldTypes';
import TypePreventiveTextField from './TypingPreventionTextField';

const stringHebrew = yup
  .string()
  .matches(HEBREW_TEXT_REGEX, hebrewTextErrorMessage)
  .max(50, max50LengthErrorMessage);

const HebrewTextField: HebrewTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        error={props.error ?? ''}
        value={props.value || ''}
        validationSchema={stringHebrew}
    />
  );
};

export default HebrewTextField;