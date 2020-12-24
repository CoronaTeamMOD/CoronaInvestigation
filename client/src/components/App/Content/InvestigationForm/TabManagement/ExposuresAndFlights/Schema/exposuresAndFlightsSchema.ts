import * as yup from 'yup';

import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const isExposureSource = (exposure : Exposure) => {
    return exposure.exposureSource !== undefined
}

const foo = yup.lazy((value : Exposure) : yup.Schema<any, object> => {
    console.log(value);
    if(isExposureSource(value)){
        return yup.object().shape({
            [fieldsNames.exposureSource] : yup.object().nullable().required('שדה חובה פליז'),
            [fieldsNames.date]: yup.date().nullable().required('אאאא'),
            [fieldsNames.address]: yup.object().nullable().required('plz'),
            [fieldsNames.placeType]: yup.string().nullable().required('plzzzz'),
            [fieldsNames.placeSubType]: yup.number().nullable()
        });
    } else {
        return yup.object().shape({
            [fieldsNames.airline] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.destinationAirport] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.destinationCity] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.destinationCountry] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.flightNumber] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.originAirport] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.originCity] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.originCountry] : yup.string().nullable().required('שדה חובה'),
            [fieldsNames.flightEndDate] : yup.date().nullable().required('שדה חובה'),
            [fieldsNames.flightStartDate] : yup.date().nullable().required('שדה חובה'),
        });
    } 
})

// ADD ATTENTION TO canceling invalid meetings

const ExposureSchema = yup.object().shape({
    [fieldsNames.wasInEilat]: yup.boolean().required(),
    [fieldsNames.wasInDeadSea]: yup.boolean().required(),
    [fieldsNames.wereFlights]: yup.boolean().required(),
    [fieldsNames.wereConfirmedExposures]: yup.boolean().required(),
    exposures : yup.array().of(foo),
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
