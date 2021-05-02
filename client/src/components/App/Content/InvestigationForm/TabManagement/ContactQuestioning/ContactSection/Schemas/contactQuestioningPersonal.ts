import * as yup from 'yup';

import { invalidPhoneText } from 'commons/Schema/messages';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';
import { PHONE_NUMBER_REGEX, NOT_REQUIRED_PHONE_NUMBER_REGEX} from 'commons/Regex/Regex';

export const contactQuestioningPersonal = {
    [InteractedContactFields.IDENTIFICATION_NUMBER]: yup
        .string()
        .when(
            [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.DOES_NEED_ISOLATION],
            (contactStatus: number, needIsolation: boolean, schema: any, { originalValue }: { originalValue: string }) => {
                return contactStatus === ContactStatusCodes.COMPLETED || (originalValue === '' && !needIsolation)
                    ? yup.string().nullable()
                    : ContactIdValidationSchema();
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
                    : yup.string().nullable().matches(PHONE_NUMBER_REGEX, invalidPhoneText);
            }
        ),
    [InteractedContactFields.ADDITIONAL_PHONE_NUMBER]: yup.string().when(InteractedContactFields.CONTACT_STATUS, {
        is: 5,
        then: yup.string().nullable(),
        otherwise: yup.string().nullable().matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, invalidPhoneText),
    }),
};