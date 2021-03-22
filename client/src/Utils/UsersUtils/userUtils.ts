import * as yup from 'yup';

import { USER_REGEX } from 'commons/Regex/Regex';

const errorMessage = 'הוכנס תו לא תקין'
const maxLengthErrorMessage = 'החיפוש יכול להכיל 100 תווים בלבד';

export const userValidationSchema = yup
  .string()
  .matches(USER_REGEX, errorMessage)
  .max(100, maxLengthErrorMessage);

export const defaultUser = {
    id: '',
    userName: '',
    phoneNumber: '',
    serialNumber: '',
    investigationGroup: -1
};