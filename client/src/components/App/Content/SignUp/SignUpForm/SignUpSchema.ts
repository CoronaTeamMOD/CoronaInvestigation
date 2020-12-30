import * as yup from 'yup';

import SignUpFields from 'models/enums/SignUpFields'
import { isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'
import { phoneNumberRegex, mailValidation } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const requiredMessage = 'שדה חובה'

const SignUpSchema = yup.object().shape({
    [SignUpFields.MABAR_USER_NAME]: yup.string().nullable().required(requiredMessage)
        .matches(/^((?!@).)*$/, 'שם משתמש לא אמור להכיל @'),
    [SignUpFields.FULL_NAME]: yup.object().shape({
        [SignUpFields.FIRST_NAME]: yup.string().nullable().required(requiredMessage),
        [SignUpFields.LAST_NAME]: yup.string().nullable().required(requiredMessage)
    }),
    [SignUpFields.CITY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredMessage)
        .matches(phoneNumberRegex, 'מספר טלפון לא תקין'),
    [SignUpFields.ID]: yup.string().nullable().required(requiredMessage)
        .length(9, 'ת.ז מכילה 9 מספרים בלבד')
        .test('isValid', "ת.ז לא תקינה", id => isIdValid(id)),
    [SignUpFields.MAIL]: yup.string().nullable().required(requiredMessage).matches(mailValidation, 'מייל לא תקין'),
    [SignUpFields.COUNTY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.SOURCE_ORGANIZATION]: yup.string().nullable().required(requiredMessage),
})

export default SignUpSchema;