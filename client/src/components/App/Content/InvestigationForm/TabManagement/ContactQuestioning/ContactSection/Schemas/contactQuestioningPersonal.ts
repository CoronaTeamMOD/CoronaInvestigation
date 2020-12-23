import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';

const phoneNumberMatchValidation = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;

export const contactQuestioningPersonal = {
    [InteractedContactFields.IDENTIFICATION_NUMBER]: ContactIdValidationSchema,
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
