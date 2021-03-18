import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactType from 'models/enums/ContactType';

const errorMessage = 'שגיאה: שדה חובה'

export const contactQuestioningClinical = {
    [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
    [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(ALPHANUMERIC_TEXT_REGEX, 'השדה יכול להכיל רק אותיות ומספרים'),
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup
        .boolean()
        .nullable(),
    [InteractedContactFields.ISOLATION_ADDRESS]: yup.object()
    .when(InteractedContactFields.DOES_NEED_ISOLATION, {
        is: true,
        then: yup.object().shape({
            'city': yup.string().nullable().required(errorMessage),
            'street': yup.string().nullable().required(errorMessage),
            'houseNum': yup.string().nullable().required(errorMessage)
        }),
        otherwise: yup.object().nullable()
    })
};
