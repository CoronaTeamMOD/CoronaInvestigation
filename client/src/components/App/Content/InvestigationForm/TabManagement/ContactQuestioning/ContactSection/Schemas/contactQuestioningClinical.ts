import * as yup from 'yup';

import { requiredText } from 'commons/Schema/messages';
import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';

export const contactQuestioningClinical = {
    [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
    [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(ALPHANUMERIC_TEXT_REGEX, 'השדה יכול להכיל רק אותיות ומספרים'),
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup.boolean()
    .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.DOES_NEED_ISOLATION]: yup.boolean()
    .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.ISOLATION_ADDRESS]: yup.object()
    .when([InteractedContactFields.DOES_NEED_ISOLATION , InteractedContactFields.CONTACT_STATUS], 
        (needIsolation: boolean, contactStatus: number, schema: any) => {
            return (contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE )
                ? yup.object().nullable()
                : contactStatus === ContactStatusCodes.COMPLETED || !needIsolation
                    ? yup.object().nullable()
                    : yup.object().shape({
                        'city': yup.string().nullable().required(requiredText)
                    })
        })
};