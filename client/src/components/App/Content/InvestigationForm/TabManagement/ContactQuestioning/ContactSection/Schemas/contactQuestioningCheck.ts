import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';
import { requiredText } from 'commons/Schema/messages';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';

export const contactQuestioningCheck = {
    [InteractedContactFields.DOES_FEEL_GOOD]: yup.boolean()
        .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus ===ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean()
        .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus ===ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.DOES_LIVE_WITH_CONFIRMED]: yup.boolean()
        .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus ===ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED]: yup.boolean()
        .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus ===ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.DOES_WORK_WITH_CROWD]: yup.boolean()
        .when(
        [InteractedContactFields.CONTACT_STATUS],
        (contactStatus: number) => {
            return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus ===ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED )
                ? yup.boolean().nullable()
                : yup.boolean().nullable().required(requiredText);
        }
    ),
    [InteractedContactFields.OCCUPATION]: yup.string().nullable(),
};
