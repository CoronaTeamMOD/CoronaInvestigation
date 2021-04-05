import * as yup from 'yup';

import SignUpFields from 'models/enums/SignUpFields';
import { isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { PHONE_NUMBER_REGEX, MAIL_REGEX, SPECIAL_CHARS_REGEX } from 'commons/Regex/Regex';
import { invalidEmailText, invalidIdText, invalidPhoneText, requiredText } from 'commons/Schema/messages';

export const SignUpSchema = yup.object().shape({
    [SignUpFields.MABAR_USER_NAME]: yup.string().nullable().required(requiredText)
        .matches(SPECIAL_CHARS_REGEX, 'שם משתמש לא אמור להכיל @'),
    [SignUpFields.FULL_NAME]: yup.object().shape({
        [SignUpFields.FIRST_NAME]: yup.string().nullable().required(requiredText),
        [SignUpFields.LAST_NAME]: yup.string().nullable().required(requiredText)
    }),
    [SignUpFields.CITY]: yup.string().nullable().required(requiredText),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredText)
        .matches(PHONE_NUMBER_REGEX, invalidPhoneText),
    [SignUpFields.ID]: yup.string().nullable().required(requiredText)
        .length(9, 'ת.ז מכילה 9 מספרים בלבד')
        .test('isValid', invalidIdText, id => isIdValid(id)),
    [SignUpFields.MAIL]: yup.string().nullable().required(requiredText).matches(MAIL_REGEX, invalidEmailText),
    [SignUpFields.COUNTY]: yup.string().nullable().required(requiredText),
    [SignUpFields.SOURCE_ORGANIZATION]: yup.string().nullable().required(requiredText),
});

export const EditSchema = yup.object().shape({
    [SignUpFields.CITY]: yup.string().nullable().required(requiredText),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredText)
        .matches(PHONE_NUMBER_REGEX, invalidPhoneText),
    [SignUpFields.MAIL]: yup.string().nullable().required(requiredText).matches(MAIL_REGEX, invalidEmailText),
    [SignUpFields.COUNTY]: yup.string().nullable().required(requiredText),
    [SignUpFields.SOURCE_ORGANIZATION]: yup.string().nullable().required(requiredText),
});