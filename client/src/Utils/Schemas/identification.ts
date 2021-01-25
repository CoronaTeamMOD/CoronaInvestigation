import * as yup from 'yup';

import { ID_BASIC_VALIDATION_REGEX, PASSPORT_DASH_REGEX } from 'commons/Regex/Regex';
import { visaLength , idLength } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const errorMessage = 'הוכנס תו לא חוקי';
const passportMaxLengthErrorMessage = `השדה יכול להכיל ${visaLength} תווים בלבד`;
const idMaxLengthErrorMessage = `השדה יכול להכיל ${idLength} תווים בלבד`;

export const passportSchema = yup
  .string()
  .matches(PASSPORT_DASH_REGEX, errorMessage)
  .max(visaLength, passportMaxLengthErrorMessage);

export const idSchema = yup
  .string()
  .matches(ID_BASIC_VALIDATION_REGEX, errorMessage)
  .max(idLength, idMaxLengthErrorMessage);