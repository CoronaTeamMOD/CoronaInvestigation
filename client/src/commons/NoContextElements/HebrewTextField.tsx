import React from 'react';
import * as yup from 'yup';

import { HEBREW_TEXT_REGEX } from 'commons/Regex/Regex';

import HebrewTextFieldType from './HebrewTextFieldTypes';
import TypePreventiveTextField from './TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות בעברית';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const stringHebrew = yup
  .string()
  .matches(HEBREW_TEXT_REGEX, errorMessage)
  .max(50, maxLengthErrorMessage);


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