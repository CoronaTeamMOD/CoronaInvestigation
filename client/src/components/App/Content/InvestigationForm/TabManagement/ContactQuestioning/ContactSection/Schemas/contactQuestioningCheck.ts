import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';
import { requiredText } from 'commons/Schema/messages';

export const contactQuestioningCheck = {
    [InteractedContactFields.DOES_FEEL_GOOD]: yup.boolean().nullable().required(requiredText),
    [InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean().nullable().required(requiredText),
    [InteractedContactFields.DOES_LIVE_WITH_CONFIRMED]: yup.boolean().nullable().required(requiredText),
    [InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED]: yup.boolean().nullable().required(requiredText),
    [InteractedContactFields.DOES_WORK_WITH_CROWD]: yup.boolean().nullable().required(requiredText),
    [InteractedContactFields.OCCUPATION]: yup.string().nullable(),
};
