import React from 'react';
import * as yup from 'yup';

import { FLIGHT_NUMBER_REGEX } from 'commons/Regex/Regex';

import FlightNumberTextFieldTypes from './FlightNumberTextFieldTypes';
import TypePreventiveTextField from '../TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'הזנת תו לא תקין';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';

export const flightNumber = yup
  .string()
  .matches(FLIGHT_NUMBER_REGEX, errorMessage)
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
