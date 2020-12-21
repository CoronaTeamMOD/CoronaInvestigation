import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

export const contactQuestioningCheck = {
    [InteractedContactFields.DOES_FEEL_GOOD]: yup.boolean(),
    [InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES]: yup
        .boolean()
        .nullable(),
    [InteractedContactFields.DOES_LIVE_WITH_CONFIRMED]: yup
        .boolean()
        .nullable(),
    [InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED]: yup
        .boolean()
        .nullable(),
    [InteractedContactFields.DOES_WORK_WITH_CROWD]: yup.boolean().nullable(),
    [InteractedContactFields.OCCUPATION]: yup.string().nullable(),
};
