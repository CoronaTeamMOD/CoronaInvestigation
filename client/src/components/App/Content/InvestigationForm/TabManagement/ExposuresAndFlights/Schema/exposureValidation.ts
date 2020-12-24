import * as yup from 'yup';

import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const exposureValidation = yup.object().shape({
    [fieldsNames.exposureSource] : yup.object().nullable().required('שדה חובה פליז'),
    [fieldsNames.date]: yup.date().nullable().required('אאאא'),
    [fieldsNames.address]: yup.object().nullable().required('plz'),
    [fieldsNames.placeType]: yup.string().nullable().required('plzzzz'),
    [fieldsNames.placeSubType]: yup.number().nullable()
});

export default exposureValidation;