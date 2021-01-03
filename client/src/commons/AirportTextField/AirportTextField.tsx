import React from 'react';
import * as yup from 'yup';

import useStyles from './AirportTextFieldStyles';
import AirportTextFieldType from './AirportTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל אותיות, רווחים ומקפים';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 אותיות בלבד';

const airport = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe-\s]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);

const AirportTextField: AirportTextFieldType = (props) => {

  const classes = useStyles();

  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={airport}
        InputLabelProps={{
          className: classes.label,
        }}
    />
  );
};

export default AirportTextField;