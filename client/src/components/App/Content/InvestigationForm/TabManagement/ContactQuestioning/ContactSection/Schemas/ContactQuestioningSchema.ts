import * as yup from 'yup';

import { contactQuestioningInfo } from './contactQuestioningInfo';
import { contactQuestioningCheck } from './contactQuestioningCheck';
import { contactQuestioningClinical } from './contactQuestioningClinical';
import { contactQuestioningPersonal } from './contactQuestioningPersonal';

const interactionEventSchema = yup.object().shape({
    form: yup.array().of(
        yup.object().shape({
            ...contactQuestioningInfo,
            ...contactQuestioningPersonal,
            ...contactQuestioningClinical,
            ...contactQuestioningCheck,
        })
    ),
});

export default interactionEventSchema;