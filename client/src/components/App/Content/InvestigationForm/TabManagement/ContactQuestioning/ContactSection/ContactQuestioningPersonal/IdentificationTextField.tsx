import React from 'react';
import * as yup from 'yup';

import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'קלט לא ולידי';
const maxLengthErrorMessage = 'השדה יכול להכיל 15 אותיות בלבד';

const stringAlphabet = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\/\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);

const IdentificationTextField = (props : any) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphabet}
    />
  );
};

export default IdentificationTextField;