import * as yup from 'yup';

import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';
import { invalidPhoneText, requiredText } from 'commons/Schema/messages';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';
import { PHONE_NUMBER_REGEX, NOT_REQUIRED_PHONE_NUMBER_REGEX} from 'commons/Regex/Regex';

export const contactQuestioningPersonal = {
    [InteractedContactFields.IDENTIFICATION_NUMBER]: yup
        .string()
        .when(
            [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.DOES_NEED_ISOLATION, InteractedContactFields.IDENTIFICATION_TYPE],
            (contactStatus: number, needIsolation: boolean, identificationType: number, schema: any, { originalValue }: { originalValue: string }) => {
                return (contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.string().nullable()
                : (contactStatus === ContactStatusCodes.COMPLETED ||  !needIsolation) &&  (identificationType == null || identificationType === 6)
                    ? yup.string().nullable()
                    : ContactIdValidationSchema();
            }
        ),
    [InteractedContactFields.IDENTIFICATION_TYPE]: yup.number().when(
        [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.IDENTIFICATION_NUMBER], (contactStatus: number, identificationNumber: string | null) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED)
            ? yup.number().nullable()
            : identificationNumber == null
                ? yup.number().nullable() 
                : yup.number().required(requiredText).nullable()
        }
    ),
    [InteractedContactFields.BIRTH_DATE]: yup.date().max(new Date()).nullable(),
    [InteractedContactFields.PHONE_NUMBER]: yup
        .string()
        .when(
            [InteractedContactFields.CONTACT_STATUS, InteractedContactFields.DOES_NEED_ISOLATION],
            (contactStatus: number, needIsolation: boolean, schema: any, { originalValue }: { originalValue: string }) => {
                return (contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED)
                ? yup.string().nullable()
                : contactStatus === ContactStatusCodes.COMPLETED || (originalValue === '' && !needIsolation)
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