import * as yup from 'yup';

import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import flightValidation from './flightsValidation';
import exposureValidation from './exposureValidation';

const hasExposureSource = (exposure : Exposure) => {
    return exposure.exposureSource !== undefined
}

const flightsAndExposures = (validationDate : Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
            if (hasExposureSource(exposure)) {
                return exposureValidation(validationDate);
            } else {
                return flightValidation;
            }
        }
    );
};

const flights = (validationDate : Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
            if(hasExposureSource(exposure)) {
                return yup.object();
            } else {
                return flightValidation;
            }
        }
    );
};

const exposures = (validationDate : Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
            if(hasExposureSource(exposure)) {
                return exposureValidation(validationDate);
            } else {
                return yup.object();
            }
        }
    );
};

const ExposureSchema = (validationDate : Date) => {
    return yup.object().shape({
    [fieldsNames.wasInEilat]: yup.boolean().required(),
    [fieldsNames.wasInDeadSea]: yup.boolean().required(),
    [fieldsNames.wereFlights]: yup.boolean().required(),
    [fieldsNames.wereConfirmedExposures]: yup.boolean().required(),
    exposures : yup.array().when(
        ['wereFlights','wereConfirmedExposures'] , {
            is: true,
            then: yup.array().of(flightsAndExposures(validationDate)),
            otherwise: yup.array().when([fieldsNames.wereFlights] , {
                is : true,
                then: yup.array().of(flights(validationDate)),
                otherwise: yup.array().when([fieldsNames.wereConfirmedExposures] , {
                    is : true,
                    then: yup.array().of(exposures(validationDate)),
                    otherwise: yup.array().of(yup.object())
                })
            })
        }
        )
});
}

export default ExposureSchema;
