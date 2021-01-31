import React from 'react';
import * as yup from 'yup';

import { ALPHBET_TEXT_REGEX } from 'commons/Regex/Regex';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const stringAlphabet = yup
  .string()
  .matches(ALPHBET_TEXT_REGEX, errorMessage)
  .max(50, maxLengthErrorMessage);


const AlphabetTextField: AlphbetTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphabet}
    />
  );
};

export default AlphabetTextField;