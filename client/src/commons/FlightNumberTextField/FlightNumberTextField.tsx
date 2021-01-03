import React from 'react';
import * as yup from 'yup';

import FlightNumberTextFieldTypes from './FlightNumberTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'הזנת תו לא תקין';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';

const flightNumberRegex = /^[a-zA-Z0-9-\s//\\]*$/;

export const flightNumber = yup
  .string()
  .matches(flightNumberRegex, errorMessage)
  .max(50, maxLengthErrorMessage);

const FlightNumberTextField: FlightNumberTextFieldTypes = (props) => {

  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={flightNumber}
    />
  );
};

export default FlightNumberTextField;
