import React from 'react';
import * as yup from 'yup';

import InternationalCityTextFieldType from './InternationalCityTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל אותיות, רווחים ומקפים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const internationalCity = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe-\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);

const InternationalCityTextField: InternationalCityTextFieldType = (props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={internationalCity}
    />
  );
};

export default InternationalCityTextField;