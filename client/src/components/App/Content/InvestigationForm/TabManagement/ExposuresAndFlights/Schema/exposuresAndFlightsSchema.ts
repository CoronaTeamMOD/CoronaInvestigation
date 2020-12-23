import * as yup from 'yup';

import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';


const foo = yup.lazy((value : any) => {
    if(Boolean(value[fieldsNames.exposureSource])){
        return yup.object().shape({
            [fieldsNames.exposureSource] : yup.object().required('שדה חובה פליז'),
            [fieldsNames.date]: yup.date().required('אאאא'),
            [fieldsNames.address]: yup.object().required('plz'),
            [fieldsNames.placeType]: yup.string().required('plzzzz'),
            [fieldsNames.placeSubType]: yup.number().nullable()
        });
    } else {
        return yup.string();
    }
})

const ExposureSchema = yup.object().shape({
    [fieldsNames.wasInEilat]: yup.boolean().required(),
    [fieldsNames.wasInDeadSea]: yup.boolean().required(),
    [fieldsNames.wereFlights]: yup.boolean().required(),
    [fieldsNames.wereConfirmedExposures]: yup.boolean().required(),
    exposures : yup.array().of(
        foo
        ),
    // form: yup.array().of(
    //     wasInEilat : boolean;
    //     wasInDeadSea : boolean;
    //     exposures : Exposure[]
    //     wereFlights : boolean;
    //     wereConfirmedExposures : boolean;
    // ),
});

export default ExposureSchema;

// wasInEilat : boolean;
// wasInDeadSea : boolean;
// exposures : Exposure[]
// wereFlights : boolean;
// wereConfirmedExposures : boolean;
