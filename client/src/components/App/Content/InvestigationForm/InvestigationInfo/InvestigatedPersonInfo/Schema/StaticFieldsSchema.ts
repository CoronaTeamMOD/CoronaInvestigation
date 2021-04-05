import * as yup from 'yup';

import StaticFields from 'models/enums/StaticFields';
import { FULL_NAME_REGEX } from 'commons/Regex/Regex';
import { invalidFullNameText, requiredText } from 'commons/Schema/messages';

const StaticFieldsSchema = yup.object().shape({
    [StaticFields.FULL_NAME]: yup.string().nullable().required(requiredText).matches(FULL_NAME_REGEX, invalidFullNameText),
});

export default StaticFieldsSchema;