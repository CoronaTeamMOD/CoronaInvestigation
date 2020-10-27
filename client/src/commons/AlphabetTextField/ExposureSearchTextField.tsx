import React from 'react';
import * as yup from 'yup';

import AlphbetTextFieldType from './AlphabetTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const stringAlphabet = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe\s0-9-]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


const ExposureSearchTextField: AlphbetTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        validationSchema={stringAlphabet}
    />
  );
};

export default ExposureSearchTextField;