import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

import { contactQuestioningInfo } from './contactQuestioningInfo';
import { contactQuestioningCheck } from './contactQuestioningCheck';
import { contactQuestioningClinical } from './contactQuestioningClinical';
import { contactQuestioningPersonal } from './contactQuestioningPersonalSchema';


const interactionEventSchema = yup.object().shape({
            ...contactQuestioningInfo,
            ...contactQuestioningPersonal,
            ...contactQuestioningClinical,
   }
    ,[[InteractedContactFields.IDENTIFICATION_TYPE, InteractedContactFields.IDENTIFICATION_NUMBER]])

export default interactionEventSchema;