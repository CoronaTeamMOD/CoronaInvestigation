import React from 'react';
import * as yup from 'yup';

import AlphbetWithDashTextFieldType from './AlphabetWithDashTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const stringAlphabet = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe-\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


const AlphabetWithDashTextField: AlphbetWithDashTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphabet}
    />
  );
};

export default AlphabetWithDashTextField;