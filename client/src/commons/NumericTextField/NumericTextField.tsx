import React from 'react';
import * as yup from 'yup';

import NumericTextFieldType from './NumericTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const maxLengthErrorMessage = 'השדה יכול להכיל 10 מספרים בלבד';
const alphabeticErrorMessage = 'השדה יכול להכיל מספרים בלבד';

const stringAlphabet = yup.string().matches(/^[0-9]*$/, alphabeticErrorMessage).max(10, maxLengthErrorMessage);

const NumericTextField: NumericTextFieldType = (props) => {

  const { value, ...other } = props;

  return (
    <TypePreventiveTextField
      value={value || ''}
      validationSchema={stringAlphabet}
      {...other}
    />
  );
};

export default NumericTextField;
