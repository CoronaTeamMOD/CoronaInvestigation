import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';

export const contactQuestioningClinical = {
    [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
    [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/, 'השדה יכול להכיל רק אותיות ומספרים'),
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup
        .boolean()
        .nullable(),
    [InteractedContactFields.ISOLATION_ADDRESS]: yup.object()
    .when(InteractedContactFields.CONTACT_STATUS, {
        is: ContactStatusCodes.COMPLETED,
        then: yup.object().nullable(),
        otherwise: yup.object().shape({
                 'city': yup.string().nullable().required('שגיאה: שדה חובה')
             })
    })
};
