import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

export const contactQuestioningInfo = {
    [InteractedContactFields.CONTACT_STATUS]: yup.number(),
};
