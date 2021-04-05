import React from 'react';
import * as yup from 'yup';

import { ALPHBET_TEXT_REGEX } from 'commons/Regex/Regex';
import { max50LengthErrorMessage, alphbetErrorMessage } from 'commons/Schema/messages';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabet = yup
  .string()
  .matches(ALPHBET_TEXT_REGEX, alphbetErrorMessage)
  .max(50, max50LengthErrorMessage);


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