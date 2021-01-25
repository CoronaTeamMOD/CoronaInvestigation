import * as yup from 'yup';

const errorMessage = 'הוכנס תו לא תקין'
const maxLengthErrorMessage = 'החיפוש יכול להכיל 100 תווים בלבד';

export const userValidationSchema = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe0-9\\s\\._\\(\\),'\\"!^~#\\-\\@]*$/, errorMessage)
  .max(100, maxLengthErrorMessage);

export const defaultUser = {
    id: '',
    userName: '',
    phoneNumber: '',
    serialNumber: '',
    investigationGroup: -1
}