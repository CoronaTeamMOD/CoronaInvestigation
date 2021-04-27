import * as yup from 'yup';

import { visaLength , idLength } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { ID_BASIC_VALIDATION_REGEX, NUMERIC_TEXT_REGEX, PALESTINE_ID_REGEX, PASSPORT_DASH_REGEX } from 'commons/Regex/Regex';

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

export const palestineIdSchema = yup
    .string()
    .matches(PALESTINE_ID_REGEX, errorMessage)
    .max(idLength, idMaxLengthErrorMessage);

export const otherIdSchema = yup
    .string()
    .matches(NUMERIC_TEXT_REGEX, errorMessage);