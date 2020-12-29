import React from 'react';
import * as yup from 'yup';

import { generalIdentificationValidation, maxIdentificationLength } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'הוכנס תו לא וולידי';
const maxLengthErrorMessage = `השדה יכול להכיל ${maxIdentificationLength} תווים בלבד`;

export const stringAlphanum = yup
  .string()
  .matches(generalIdentificationValidation, errorMessage)
  .max(maxIdentificationLength, maxLengthErrorMessage);

const IdentificationTextField = (props : Props) => {
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={stringAlphanum}
    />
  );
};

interface Props{
    disabled?: boolean,
    testId?: string,
    name: string,
    value: string | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
}


export default IdentificationTextField;