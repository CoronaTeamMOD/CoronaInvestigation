import * as yup from 'yup';

import StaticFields from 'models/enums/StaticFields';

const requiredText = 'שדה חובה';

const StaticFieldsSchema = yup.object().shape({
    [StaticFields.FULL_NAME]: yup.string().nullable().required(requiredText),
});

export default StaticFieldsSchema;