import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

export const contactQuestioningClinical = {
    [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
    [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(/^[a-zA-Z\u0590-\u05fe0-9\s]*$/, 'השדה יכול להכיל רק אותיות ומספרים'),
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup
        .boolean()
        .nullable(),
};
