import React from 'react';
import * as yup from 'yup';

import { passportValidation, passportMaxIdentificationLength , idLength , idBasicValidation} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

const errorMessage = 'הוכנס תו לא וולידי';
const passportMaxLengthErrorMessage = `השדה יכול להכיל ${passportMaxIdentificationLength} תווים בלבד`;
const idMaxLengthErrorMessage = `השדה יכול להכיל ${idLength} תווים בלבד`;

export const passportSchema = yup
  .string()
  .matches(passportValidation, errorMessage)
  .max(passportMaxIdentificationLength, passportMaxLengthErrorMessage);

export const idSchema = yup
  .string()
  .matches(idBasicValidation, errorMessage)
  .max(idLength, idMaxLengthErrorMessage);

const IdentificationTextField = (props : Props) => {
  const { isPassport } = props; 
  const schema = isPassport 
    ? passportSchema
    : idSchema;  
  return (
    <TypePreventiveTextField
        {...props}
        value={props.value || ''}
        validationSchema={schema}
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
    isPassport: boolean
}


export default IdentificationTextField;