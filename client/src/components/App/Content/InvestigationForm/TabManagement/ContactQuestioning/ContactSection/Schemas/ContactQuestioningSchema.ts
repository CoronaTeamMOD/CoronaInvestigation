import * as yup from 'yup';

import InteractedContactFields from 'models/enums/InteractedContact';

import { contactQuestioningInfo } from './contactQuestioningInfo';
import { contactQuestioningClinical } from './contactQuestioningClinical';
import { contactQuestioningPersonal } from './contactQuestioningPersonalSchema';


const interactionEventSchema = (validationDate: Date) => {
    return yup.object().shape({
        ...contactQuestioningInfo,
        ...contactQuestioningPersonal,
        ...contactQuestioningClinical(validationDate),
    }
        , [[InteractedContactFields.IDENTIFICATION_TYPE, InteractedContactFields.IDENTIFICATION_NUMBER]]);
}

export default interactionEventSchema;