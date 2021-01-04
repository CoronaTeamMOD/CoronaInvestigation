import React from 'react';
import * as yup from 'yup';

import AlphbetWithDashTextFieldType from './AlphabetWithDashTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל אותיות, רווחים ומקפים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תווים בלבד';

const stringAlphabetWithDash = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe-\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


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