import * as yup from 'yup';

import SignUpFields from 'models/enums/SignUpFields';
import { isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { PHONE_NUMBER_REGEX, MAIL_REGEX, SPECIAL_CHARS_REGEX } from 'commons/Regex/Regex';

const requiredMessage = 'שדה חובה';

export const SignUpSchema = yup.object().shape({
    [SignUpFields.MABAR_USER_NAME]: yup.string().nullable().required(requiredMessage)
        .matches(SPECIAL_CHARS_REGEX, 'שם משתמש לא אמור להכיל @'),
    [SignUpFields.FULL_NAME]: yup.object().shape({
        [SignUpFields.FIRST_NAME]: yup.string().nullable().required(requiredMessage),
        [SignUpFields.LAST_NAME]: yup.string().nullable().required(requiredMessage)
    }),
    [SignUpFields.CITY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredMessage)
        .matches(PHONE_NUMBER_REGEX, 'מספר טלפון לא תקין'),
    [SignUpFields.ID]: yup.string().nullable().required(requiredMessage)
        .length(9, 'ת.ז מכילה 9 מספרים בלבד')
        .test('isValid', "ת.ז לא תקינה", id => isIdValid(id)),
    [SignUpFields.MAIL]: yup.string().nullable().required(requiredMessage).matches(MAIL_REGEX, 'מייל לא תקין'),
    [SignUpFields.COUNTY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.SOURCE_ORGANIZATION]: yup.string().nullable().required(requiredMessage),
});

export const EditSchema = yup.object().shape({
    [SignUpFields.CITY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredMessage)
        .matches(PHONE_NUMBER_REGEX, 'מספר טלפון לא תקין'),
    [SignUpFields.MAIL]: yup.string().nullable().required(requiredMessage).matches(MAIL_REGEX, 'מייל לא תקין'),
    [SignUpFields.COUNTY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.SOURCE_ORGANIZATION]: yup.string().nullable().required(requiredMessage),
});