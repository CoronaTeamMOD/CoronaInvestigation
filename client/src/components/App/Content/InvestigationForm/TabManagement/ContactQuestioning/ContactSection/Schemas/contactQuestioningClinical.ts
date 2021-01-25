import * as yup from 'yup';

import { ALPHANUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import InteractedContactFields from 'models/enums/InteractedContact';

export const contactQuestioningClinical = {
    [InteractedContactFields.FAMILY_RELATIONSHIP]: yup.number().nullable(),
    [InteractedContactFields.RELATIONSHIP]: yup.string().nullable().matches(ALPHANUMERIC_TEXT_REGEX, 'השדה יכול להכיל רק אותיות ומספרים'),
    [InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]: yup
        .boolean()
        .nullable(),
};
