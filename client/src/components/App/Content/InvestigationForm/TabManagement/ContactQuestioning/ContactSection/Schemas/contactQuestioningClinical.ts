import * as yup from 'yup';

import { invalidDateText, requiredText } from 'commons/Schema/messages';
import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';
import { subDays } from 'date-fns';

const endDateBeforeTodayText = 'תאריך לא יכול להיות יותר מאוחר מהיום';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';


export const contactQuestioningClinical = (validationDate: Date) => {
    const twoWeeksBeforeValidationDate = subDays(new Date(validationDate), 14);
    const today = new Date();
    return {
        [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
        [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(ALPHANUMERIC_TEXT_REGEX, 'השדה יכול להכיל רק אותיות ומספרים'),
        [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup.boolean()
            .when(
                [InteractedContactFields.CONTACT_STATUS],
                (contactStatus: number) => {
                    return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED)
                        ? yup.boolean().nullable()
                        : yup.boolean().nullable().required(requiredText);
                }
            ),
        [InteractedContactFields.DOES_NEED_ISOLATION]: yup.boolean()
            .when(
                [InteractedContactFields.CONTACT_STATUS],
                (contactStatus: number) => {
                    return (contactStatus === ContactStatusCodes.COMPLETED || contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED)
                        ? yup.boolean().nullable()
                        : yup.boolean().nullable().required(requiredText);
                }
            ),
        [InteractedContactFields.ISOLATION_ADDRESS]: yup.object()
            .when([InteractedContactFields.DOES_NEED_ISOLATION, InteractedContactFields.CONTACT_STATUS],
                (needIsolation: boolean, contactStatus: number, schema: any) => {
                    return (contactStatus === ContactStatusCodes.CANT_REACH || contactStatus === ContactStatusCodes.DONT_COOPERATE || contactStatus === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED)
                        ? yup.object().nullable()
                        : contactStatus === ContactStatusCodes.COMPLETED || !needIsolation
                            ? yup.object().nullable()
                            : yup.object().shape({
                                'city': yup.string().nullable().required(requiredText)
                            })
                }),
        [InteractedContactFields.TRANSIT_DATE]: yup.date().nullable()
            .typeError(invalidDateText)
            .max(today, endDateBeforeTodayText)
            .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText)
    }
};