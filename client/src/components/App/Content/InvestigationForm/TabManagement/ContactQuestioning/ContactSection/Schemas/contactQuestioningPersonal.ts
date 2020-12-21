import * as yup from 'yup';

import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import { isIdValid , isPassportValid} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const phoneNumberMatchValidation = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;

export const contactQuestioningPersonal = {
    [InteractedContactFields.IDENTIFICATION_TYPE]: yup
        .string()
        .required('סוג זיהוי חובה'),
    [InteractedContactFields.IDENTIFICATION_NUMBER]: yup
        .string()
        .when(InteractedContactFields.IDENTIFICATION_TYPE, {
            is: IdentificationTypes.ID,
            then: yup
                .string()
                .nullable()
                .matches(/^\d+|^$/, 'ת.ז חייבת להכיל מספרים בלבד')
                .length(9, 'ת.ז מכילה 9 מספרים בלבד')
                .test('isValid', 'ת.ז לא תקינה', (id) => isIdValid(id)),
            otherwise: yup.string().nullable().test('isValid', 'דרכון לא תקין', (id) => isPassportValid(id)) ,
        }),
    [InteractedContactFields.BIRTH_DATE]: yup.date().nullable(),
    [InteractedContactFields.PHONE_NUMBER]: yup
        .string()
        .nullable()
        .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
    [InteractedContactFields.ADDITIONAL_PHONE_NUMBER]: yup
        .string()
        .nullable()
        .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
};
