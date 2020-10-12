import * as yup from 'yup';

import { isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import SignUpFields from './SignUpFields'

const phoneNumberMatchValidation = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/;
const mailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const requiredMessage = 'שדה חובה'

const SignUpSchema = yup.object().shape({
    [SignUpFields.MABAR_USER_NAME]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.FIRST_NAME]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.LAST_NAME]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.CITY]: yup.string().nullable().required(requiredMessage),
    [SignUpFields.PHONE_NUMBER]: yup.string().nullable().required(requiredMessage)
        .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
    [SignUpFields.ID]: yup.string().nullable().required(requiredMessage)
        .matches(/^\d+$/, 'ת.ז חייבת להכיל מספרים בלבד')
        .length(9, 'ת.ז מכילה 9 מספרים בלבד')
        .test('isValid', "ת.ז לא תקינה", id => isIdValid(id)),
   
    [SignUpFields.MAIL]: yup.string().required(requiredMessage).matches(mailValidation, 'מייל לא תקין')

})

export default SignUpSchema;