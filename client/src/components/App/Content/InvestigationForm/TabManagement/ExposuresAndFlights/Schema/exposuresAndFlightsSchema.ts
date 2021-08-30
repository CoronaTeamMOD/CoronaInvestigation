import * as yup from 'yup';

import { requiredText } from 'commons/Schema/messages';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import flightValidation from './flightsValidation';
import exposureValidation from './exposureValidation';

const hasExposureSource = (exposure : Exposure) => {
    return exposure?.exposureSource !== undefined
};

const flightsAndExposures = (validationDate : Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
            if (hasExposureSource(exposure)) {
                return exposureValidation(validationDate);
            } else {
                return flightValidation(validationDate);
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
                return flightValidation(validationDate);
            }
        }
    );
};

const exposures = (validationDate : Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
            const isExposurePersonKnown = false;
            if(hasExposureSource(exposure) && isExposurePersonKnown) {
                return exposureValidation(validationDate);
            } else {
                return yup.object();
            }
        }
    );
};

const ExposureSchema = (validationDate: Date) => {
    return yup.object().shape({
        [fieldsNames.wasInVacation]: yup.boolean().nullable().required(requiredText),
        [fieldsNames.wasInEvent]: yup.boolean().nullable().required(requiredText),
        [fieldsNames.wereFlights]: yup.boolean().required(),
        [fieldsNames.wereConfirmedExposures]: yup.boolean().required(),
        [fieldsNames.exposures] : yup.array().when(
            ['wereFlights','wereConfirmedExposures'] , (wereFlights: boolean, wereConfirmedExposures: boolean) => {
                return wereFlights && wereConfirmedExposures 
                    ? yup.array().of(flightsAndExposures(validationDate)) 
                    : wereFlights 
                        ? yup.array().of(flights(validationDate))
                        : wereConfirmedExposures
                            ? yup.array().of(exposures(validationDate))
                            : yup.array().of(yup.object());
            }
        )
    })
};

export default ExposureSchema;