import * as yup from 'yup';

import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import flightValidation from './flightsValidation';
import exposureValidation from './exposureValidation';
const hasExposureSource = (exposure : Exposure) => {
    return exposure.exposureSource !== undefined
}

const flightsAndExposures = yup.lazy((exposure : Exposure) : yup.Schema<any, object> => {
    console.log(exposure);
    if(hasExposureSource(exposure)){
        return exposureValidation
    } else {
        return flightValidation
    } 
});

const flights = yup.lazy((exposure : Exposure) : yup.Schema<any, object> => {
    if(hasExposureSource(exposure)) {
        return yup.object();
    } else {
        return flightValidation;
    }
});

const exposures = yup.lazy((exposure : Exposure) : yup.Schema<any, object> => {
    if(hasExposureSource(exposure)) {
        return exposureValidation;
    } else {
        return yup.object();
    }
});

const ExposureSchema = yup.object().shape({
    [fieldsNames.wasInEilat]: yup.boolean().required(),
    [fieldsNames.wasInDeadSea]: yup.boolean().required(),
    [fieldsNames.wereFlights]: yup.boolean().required(),
    [fieldsNames.wereConfirmedExposures]: yup.boolean().required(),
    exposures : yup.array().when(
        ['wereFlights','wereConfirmedExposures'] , {
            is: true,
            then: yup.array().of(flightsAndExposures),
            otherwise: yup.array().when([fieldsNames.wereFlights] , {
                is : true,
                then: yup.array().of(flights),
                otherwise: yup.array().when([fieldsNames.wereConfirmedExposures] , {
                    is : true,
                    then: yup.array().of(exposures),
                    otherwise: yup.array().of(yup.object())
                })
            })
        }
        )
});

export default ExposureSchema;
