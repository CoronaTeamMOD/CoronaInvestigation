import React from 'react';
import * as yup from 'yup';

import IdentificationNumberTextFieldType from './IdentificationNumberTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות, מספרים וסלשים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';

export const stringAlphanum = yup
  .string()
  .matches(/^[a-zA-Z0-9\s\/]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);


const IdentificationNumberTextField: IdentificationNumberTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

export default IdentificationNumberTextField;
