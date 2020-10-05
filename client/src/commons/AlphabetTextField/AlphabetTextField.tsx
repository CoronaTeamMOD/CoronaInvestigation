import React from 'react';
import * as yup from 'yup';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const stringAlphabet = yup
  .string()
  .required()
  .matches(/^[a-zA-Z\u0590-\u05fe\s]*$/);

const errorMessage = 'השדה יכול להכיל רק אותיות';

const AlphabetTextField: AlphbetTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphabet}
        errorMessage={errorMessage}
    />
  );
};

export default AlphabetTextField;