import * as yup from 'yup';

import { passportValidationWithDash, visaLength , idLength , idBasicValidation} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const errorMessage = 'הוכנס תו לא חוקי';
const passportMaxLengthErrorMessage = `השדה יכול להכיל ${visaLength} תווים בלבד`;
const idMaxLengthErrorMessage = `השדה יכול להכיל ${idLength} תווים בלבד`;

export const passportSchema = yup
  .string()
  .matches(passportValidationWithDash, errorMessage)
  .max(visaLength, passportMaxLengthErrorMessage);

export const idSchema = yup
  .string()
  .matches(idBasicValidation, errorMessage)
  .max(idLength, idMaxLengthErrorMessage);