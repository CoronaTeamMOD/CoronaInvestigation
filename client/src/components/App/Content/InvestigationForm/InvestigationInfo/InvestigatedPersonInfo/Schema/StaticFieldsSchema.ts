import * as yup from 'yup';

import StaticFields from 'models/enums/StaticFields';
import { FULL_NAME_REGEX } from 'commons/Regex/Regex';

const requiredText = 'שדה חובה';
const invalidFullNameText = 'שם לא תקין';

const StaticFieldsSchema = yup.object().shape({
    [StaticFields.FULL_NAME]: yup.string().nullable().required(requiredText).matches(FULL_NAME_REGEX, invalidFullNameText),
});

export default StaticFieldsSchema;