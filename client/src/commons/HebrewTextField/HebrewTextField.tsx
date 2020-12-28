import React from 'react';
import * as yup from 'yup';

import HebrewTextFieldType from './HebrewTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות בעברית';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const stringHebrew = yup
  .string()
  .matches(/^[\u0590-\u05fe\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


const HebrewTextField: HebrewTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringHebrew}
    />
  );
};

export default HebrewTextField;