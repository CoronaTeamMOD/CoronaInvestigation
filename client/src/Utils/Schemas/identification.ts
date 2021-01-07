import * as yup from 'yup';

import { passportValidation, passportMaxIdentificationLength , idLength , idBasicValidation} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

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