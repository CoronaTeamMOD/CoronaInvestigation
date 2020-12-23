import React from 'react';
import * as yup from 'yup';

import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'השדה יכול להכיל רק אותיות, מספרים וסלשים';
const maxLengthErrorMessage = 'השדה יכול להכיל 15 אותיות בלבד';

export const stringAlphanum = yup
  .string()
  .matches(/^[a-zA-Z0-9\s\/]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);

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