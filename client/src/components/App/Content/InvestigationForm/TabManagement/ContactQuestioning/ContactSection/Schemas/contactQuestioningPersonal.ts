import * as yup from 'yup';

import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';
import { notRequiredPhoneNumberRegex, phoneNumberRegex } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

export const contactQuestioningPersonal = {
    [InteractedContactFields.IDENTIFICATION_TYPE]: yup.string().required('סוג זיהוי חובה'),
    [InteractedContactFields.IDENTIFICATION_NUMBER]: yup
        .string()
        .when(
            [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.DOES_NEED_ISOLATION],
            (contactStatus: number, needIsolation: boolean, schema: any, { originalValue }: { originalValue: string }) => {
                return contactStatus === ContactStatusCodes.COMPLETED || (originalValue === '' && !needIsolation)
                    ? yup.string().nullable()
                    : ContactIdValidationSchema;
            }
        ),
    [InteractedContactFields.BIRTH_DATE]: yup.date().max(new Date()).nullable(),
    [InteractedContactFields.PHONE_NUMBER]: yup
        .string()
        .when(
            [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.DOES_NEED_ISOLATION],
            (contactStatus: number, needIsolation: boolean, schema: any, { originalValue }: { originalValue: string }) => {
                return contactStatus === ContactStatusCodes.COMPLETED || (originalValue === '' && !needIsolation)
                    ? yup.string().nullable()
                    : yup.string().nullable().matches(phoneNumberRegex, 'מספר טלפון לא תקין');
            }
        ),
    [InteractedContactFields.ADDITIONAL_PHONE_NUMBER]: yup.string().when(InteractedContactFields.CONTACT_STATUS, {
        is: 5,
        then: yup.string().nullable(),
        otherwise: yup.string().nullable().matches(notRequiredPhoneNumberRegex, 'מספר טלפון לא תקין'),
    }),
};
