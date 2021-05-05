import * as yup from 'yup';

import { otherIdLength , idLength } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { ID_BASIC_VALIDATION_REGEX, PALESTINE_ID_REGEX, PASSPORT_DASH_REGEX } from 'commons/Regex/Regex';
import { alphaNumericSpecialCharsErrorMessage, max15LengthNumErrorMessage, max9LengthIdErrorMessage } from 'commons/Schema/messages';

export const passportSchema = yup
    .string()
    .matches(PASSPORT_DASH_REGEX, alphaNumericSpecialCharsErrorMessage)
    .max(otherIdLength, max15LengthNumErrorMessage);

export const idSchema = yup
    .string()
    .matches(ID_BASIC_VALIDATION_REGEX, alphaNumericSpecialCharsErrorMessage)
    .max(idLength, max9LengthIdErrorMessage);

export const palestineIdSchema = yup
    .string()
    .matches(PALESTINE_ID_REGEX, alphaNumericSpecialCharsErrorMessage)
    .max(idLength, max9LengthIdErrorMessage);

export const otherIdSchema = yup
    .string()
    .matches(PASSPORT_DASH_REGEX, alphaNumericSpecialCharsErrorMessage);