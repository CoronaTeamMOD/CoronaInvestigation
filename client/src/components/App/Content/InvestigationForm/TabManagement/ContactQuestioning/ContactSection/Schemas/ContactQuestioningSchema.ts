import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

import { contactQuestioningInfo } from './contactQuestioningInfo';
import { contactQuestioningCheck } from './contactQuestioningCheck';
import { contactQuestioningClinical } from './contactQuestioningClinical';
import { contactQuestioningPersonal } from './contactQuestioningPersonalSchema';

const interactionEventSchema = yup.object().shape({
    form: yup.array().of(
        yup.object().shape({
            ...contactQuestioningInfo,
            ...contactQuestioningPersonal,
            ...contactQuestioningClinical,
            ...contactQuestioningCheck,
        },[[InteractedContactFields.IDENTIFICATION_TYPE, InteractedContactFields.IDENTIFICATION_NUMBER]])
    ),
});

export default interactionEventSchema;